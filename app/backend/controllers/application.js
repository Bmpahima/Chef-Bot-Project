import mongoose from "mongoose";
import { promises as fs } from "fs";

import User from "../models/user.js";
import Recipe from "../models/recipe.js";
import {
  AISuggestionsRecipeGenerator,
  ManualRecipeGenerator,
  imageToIngredientsGenerator,
  generateRecipeImage,
} from "../AI/recipeGenerator.js";
import { getBadges } from "../util/data-formating.js";

export const getDashboardController = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    const [recipes, total] = await Promise.all([
      Recipe.find({ userId: userId }).sort({ updatedAt: -1 }).limit(4).lean(),
      Recipe.countDocuments({ userId }),
    ]);

    if (!recipes) {
      const error = new Error("No recipes found");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      message: "Recipes found.",
      recipes: recipes,
      totalRecipes: total,
    });
  } catch (err) {
    return next(err);
  }
};

export const getImageUploadController = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      const error = new Error("Unsupported file format.");
      error.status = 400;
      return next(error);
    }
    const buf = await fs.readFile(file.path);
    const mime = file.mimetype || "image/png";
    const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;

    let parsed;
    try {
      const raw = await imageToIngredientsGenerator(dataUrl);
      parsed = JSON.parse(raw);
    } catch (err) {
      return res.status(500).json({
        error: "No ingredients detected.",
        ingredients: [],
      });
    }

    if (!parsed) {
      return res.status(400).json({
        error: "No ingredients detected.",
        ingredients: [],
      });
    }

    const ingredients = Array.isArray(parsed.ingredients)
      ? [
          ...new Set(
            parsed.ingredients
              .filter((s) => typeof s === "string")
              .map((s) => s.trim().toLowerCase())
              .filter(Boolean)
          ),
        ]
      : [];

    fs.unlink(file.path, (err) => {
      if (err) {
        return console.log(`ERROR: Failed to delete file: ${err.message}`);
      }
      console.log(`SUCCESS: File deleted: ${file.path}`);
    });

    return res.status(200).json({
      message:
        ingredients.length > 0
          ? "Ingredients detected succesfully."
          : "No ingredients detected.",
      ingredients: ingredients,
    });
  } catch (err) {
    return next(err);
  }
};

export const getImageRecipeController = async (req, res, next) => {
  try {
    const { ingredients, constraints } = req.body || {};

    if (!ingredients || ingredients.length === 0) {
      const err = new Error("ingredients must be a non-empty array of strings");
      err.status = 400;
      return next(err);
    }

    if (!constraints) {
      const err = new Error("Constraints must be a non-empty object");
      err.status = 400;
      return next(err);
    }

    const cleanIngredients = ingredients.map((s) => s.trim()).filter(Boolean);

    if (cleanIngredients.length === 0) {
      const err = new Error(
        "ingredients must contain at least one non-empty string"
      );
      err.status = 400;
      return next(err);
    }

    let recipe;
    try {
      recipe = await ManualRecipeGenerator(cleanIngredients, constraints);
    } catch (error) {
      error.status = 502;
      return next(error);
    }
    if (!recipe) {
      const err = new Error("Failed to generate a recipe based on the inputs.");
      err.status = 500;
      return next(err);
    }
    return res.status(200).json({
      message: "Recipe generated successfully.",
      recipe: JSON.parse(recipe),
    });
  } catch (error) {
    return next(error);
  }
};

export const getManualRecipeController = async (req, res, next) => {
  try {
    const { ingredients, constraints } = req.body || {};

    if (!ingredients || ingredients.length === 0) {
      const err = new Error("ingredients must be a non-empty array of strings");
      err.status = 400;
      return next(err);
    }

    if (!constraints) {
      const err = new Error("Constraints must be a non-empty object");
      err.status = 400;
      return next(err);
    }

    const cleanIngredients = ingredients.map((s) => s.trim()).filter(Boolean);

    if (cleanIngredients.length === 0) {
      const err = new Error(
        "ingredients must contain at least one non-empty string"
      );
      err.status = 400;
      return next(err);
    }

    let recipe;
    try {
      recipe = await ManualRecipeGenerator(cleanIngredients, constraints);
    } catch (error) {
      error.status = 502;
      return next(error);
    }
    if (!recipe) {
      const err = new Error("Failed to generate a recipe based on the inputs.");
      err.status = 500;
      return next(err);
    }
    return res.status(200).json({
      message: "Recipe generated successfully.",
      recipe: JSON.parse(recipe),
    });
  } catch (error) {
    return next(error);
  }
};

export const getAIRecipeController = async (req, res, next) => {
  try {
    const { constraints } = req.body || {};

    if (!constraints) {
      const err = new Error("Constraints must be a non-empty object");
      err.status = 400;
      return next(err);
    }

    let recipe;
    try {
      recipe = await AISuggestionsRecipeGenerator(constraints);
    } catch (error) {
      error.status = 502;
      return next(error);
    }
    if (!recipe) {
      const err = new Error("Failed to generate a recipe based on the inputs.");
      err.status = 500;
      return next(err);
    }
    return res.status(200).json({
      message: "Recipe generated successfully.",
      recipe: JSON.parse(recipe),
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllRecipesController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Recipe.find({ userId })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Recipe.countDocuments({ userId }),
    ]);

    const formatted = items.map((recipe) => ({
      id: recipe._id,
      name: recipe.name,
      badges: getBadges(recipe),
      imageUrl: recipe.url || null,
      updatedAt: recipe.updatedAt,
      createdAt: recipe.createdAt,
    }));

    return res.status(200).json({
      recipes: formatted,
      total,
      page,
      pageSize: limit,
    });
  } catch (error) {
    return next(error);
  }
};

export const postSaveRecipe = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { recipe } = req.body;

    if (!recipe) {
      const error = new Error("No recipe data was found.");
      error.status = 400;
      return next(error);
    }

    const response = await generateRecipeImage(recipe.name, recipe.ingredients);

    if (!response || !response.ok) {
      const error = new Error(
        response.message || "Error in Generating AI image."
      );
      error.status = 500;
      return next(error);
    }

    console.log(response.path);

    const newRecipe = new Recipe({
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      vegetarian: !!recipe.vegetarian,
      kosher: !!recipe.kosher,
      cuisine: recipe.cuisine.map((v) => v.toLowerCase()),
      difficulty: recipe.difficulty,
      flavors: recipe.flavors.map((v) => v.toLowerCase()),
      servings: recipe.servings,
      prepTimeMinutes: recipe.prepTime,
      cookTimeMinutes: recipe.cookTime,
      userId: userId,
      sourceUrl: recipe.sourceUrl || "",
      url: response.path || "",
    });

    console.log(newRecipe);

    try {
      const saved = await newRecipe.save();
      console.log("saved: " + saved);
    } catch (err) {
      console.log(err);
      err.status = 400;
      return next(err);
    }
    return res.status(201).json({ message: "Recipe saved successfully" });
  } catch (error) {
    error.status = 500;
    return next(error);
  }
};

export const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      const err = new Error("Invalid recipe id");
      err.status = 400;
      return next(err);
    }

    const recipeData = await Recipe.findById(id)
      .populate({ path: "userId", select: "username" })
      .lean();

    if (!recipeData) {
      const err = new Error("Recipe not found.");
      err.status = 404;
      return next(err);
    }

    const formatted = {
      _id: recipeData._id,
      name: recipeData.name,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      cuisine: recipeData.cuisine,
      flavors: recipeData.flavors,
      kosher: recipeData.kosher,
      vegetarian: recipeData.vegetarian,
      badges: getBadges(recipeData),
      imageUrl: recipeData.url || null,
      updatedAt: recipeData.updatedAt,
      cookTimeMinutes: recipeData.cookTimeMinutes,
      prepTimeMinutes: recipeData.prepTimeMinutes,
      difficulty: recipeData.difficulty,
      servings: recipeData.servings,
      createdAt: recipeData.createdAt,
      username: recipeData.userId.username,
    };

    console.log(formatted);

    return res
      .status(200)
      .json({ message: "Recipe found!", recipe: formatted });
  } catch (error) {
    return next(error);
  }
};

export const deleteRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!mongoose.isValidObjectId(id)) {
      const err = new Error("Invalid recipe id");
      err.status = 400;
      return next(err);
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      const err = new Error(`Recipe with id: ${id} was not found.`);
      err.status = 400;
      return next(err);
    }
    if (recipe.userId._id.toString() !== userId.toString()) {
      const err = new Error(`Unauthorized! User can't delete this recipe.`);
      err.status = 401;
      return next(err);
    }

    const deleted = await Recipe.deleteOne({ _id: id });
    if (!deleted || deleted.deletedCount !== 1) {
      const err = new Error(`Failed to delete recipe id ${id}`);
      err.status = 500;
      return next(err);
    }

    return res
      .status(200)
      .json({ deleted: true, message: "Recipe deleted succesfully." });
  } catch (error) {
    return next(error);
  }
};

export const putEditRecipeController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { updatedRecipe } = req.body;
    console.log(updatedRecipe);

    if (!updatedRecipe || !updatedRecipe._id) {
      const err = new Error("Invalid input on editing recipe.");
      err.status = 400;
      return next(err);
    }
    const editable = [
      "name",
      "cuisine",
      "difficulty",
      "cookTimeMinutes",
      "flavors",
      "ingredients",
      "instructions",
      "kosher",
      "prepTimeMinutes",
      "servings",
      "vegetarian",
    ];

    const $set = Object.fromEntries(
      editable
        .filter((k) => updatedRecipe[k] !== undefined)
        .map((k) => [k, updatedRecipe[k]])
    );

    const r = await Recipe.updateOne(
      { _id: updatedRecipe._id, userId },
      { $set },
      { runValidators: true }
    );

    if (r.matchedCount === 0) {
      const err = new Error("Recipe not found or not owned by user.");
      err.status = 404;
      return next(err);
    }

    return res.status(200).json({ message: "Recipe updated successfully" });
  } catch (error) {
    return next(error);
  }
};

export const getProfileDataController = async (req, res, next) => {
  try {
    const userId = req.userId;

    const [recipes, total] = await Promise.all([
      Recipe.find({ userId: userId })
        .sort({ updatedAt: -1 })
        .limit(4)
        .select("_id name url updatedAt")
        .lean(),
      Recipe.countDocuments({ userId }),
    ]);

    if (!recipes) {
      const error = new Error("No recipes found");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      message: "Recipes found.",
      recipes: recipes,
      totalRecipes: total,
    });
  } catch (error) {
    return next(error);
  }
};
