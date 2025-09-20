import mongoose from "mongoose";
import { promises as fs } from "fs";

import User from "../models/user.js";
import Recipe from "../models/recipe.js";
import {
  AISuggestionsRecipeGenerator,
  ManualRecipeGenerator,
  imageToIngredientsGenerator,
} from "../AI/recipeGenerator.js";

export const getDashboardController = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    const recipes = await Recipe.find({ userId: userId })
      .sort({ updatedAt: -1 })
      .lean();
    if (!recipes) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ message: "Recipes found.", recipes: recipes });
  } catch (err) {
    return next(err);
  }
};

export const getImageUploadController = async (req, res, next) => {
  try {
    const file = req.file;
    console.log(file);
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

    res.status(200).json({
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
    res.status(200).json({
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
    res.status(200).json({
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
    res.status(200).json({
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
    const limit = parseInt(req.query.limit, 10 || 9);
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
      badges: [
        recipe.difficulty,
        ...(recipe.cuisine || []),
        ...(recipe.flavors || []),
        recipe.kosher ? "Kosher" : undefined,
        recipe.vegetarian ? "Vegetarian" : undefined,
      ].filter(Boolean),
      imageUrl: recipe.imageUrl || null,
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
      url: recipe.url || "",
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
    res.status(201).json({ message: "Recipe saved successfully" });
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
      id: recipeData._id,
      name: recipeData.name,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      badges: [
        recipeData.difficulty,
        ...(recipeData.cuisine || []),
        ...(recipeData.flavors || []),
        recipeData.kosher ? "Kosher" : undefined,
        recipeData.vegetarian ? "Vegetarian" : undefined,
      ].filter(Boolean),
      imageUrl: recipeData.sourceUrl || null,
      updatedAt: recipeData.updatedAt,
      cookTime: recipeData.cookTimeMinutes,
      prepTime: recipeData.prepTimeMinutes,
      servings: recipeData.servings,
      createdAt: recipeData.createdAt,
      username: recipeData.userId.username,
    };

    console.log(formatted);

    res.status(200).json({ message: "Recipe found!", recipe: formatted });
  } catch (error) {
    return next(error);
  }
};
