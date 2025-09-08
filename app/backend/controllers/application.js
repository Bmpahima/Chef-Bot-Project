import User from "../models/user.js";
import Recipe from "../models/recipe.js";

export const getDashboardController = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      next(error);
    }

    const recipes = await Recipe.find({ userId: userId })
      .sort({ updatedAt: -1 })
      .lean();
    if (!recipes) {
      const error = new Error("User not found");
      error.status = 404;
      next(error);
    }

    res.status(200).json({ message: "Recipes found.", recipes: recipes });
  } catch (err) {
    next(err);
  }
};

export const getImageUploadController = (req, res, next) => {
  try {
    const file = req.file;
    console.log(file);
    if (!file) {
      const error = new Error("Unsupported file format.");
      error.status = 400;
      next(error);
    }
    res.status(200).json({
      message: "Ingredients detected succesfully.",
      ingredients: ["tomatoes", "onions", "meat"],
    });
  } catch (err) {
    next(err);
  }
};

export const getImageRecipeController = (req, res, next) => {
  const { ingredients, constraints } = req.body;
  console.log(ingredients, constraints);

  res.status(200).json({
    message: "Recipe generated.",
    recipe: "New Recipe",
  });
};

export const getManualRecipeController = (req, res, next) => {
  const { ingredients, constraints } = req.body;
  console.log(ingredients, constraints);

  res.status(200).json({
    message: "Recipe generated.",
    recipe: "New Recipe",
  });
};

export const getAIRecipeController = (req, res, next) => {
  const { constraints } = req.body;
  console.log(constraints);

  res.status(200).json({
    message: "Recipe generated.",
    recipe: "New Recipe",
  });
};

export const getAllRecipesController = (req, res, next) => {
  const { constraints } = req.body;
  console.log(constraints);

  res.status(200).json({
    message: "Recipe generated.",
    recipe: "New Recipe",
  });
};

// ##############################################################
//                            FORMAT
// ##############################################################
// const defaultRecipe = {
//   name: "Cheakpea Salad",
//   badges: ["Italian", "Easy", "Vegan", "Kosher"],
//   servings: 4,
//   prepTime: "15 min",
//   cookTime: "10 min",
//   ingredients: [
//     { ingredientName: "cherry tomatoes", amount: 400, unit: "g" },
//     { ingredientName: "cucumber", amount: 200, unit: "g" },
//     { ingredientName: "red onion", amount: 100, unit: "g" },
//     { ingredientName: "feta cheese", amount: 50, unit: "g" },
//     { ingredientName: "chickpeas", amount: 50, unit: "g" },
//     { ingredientName: "olive oil", amount: 2, unit: "tsbp" },
//   ],
//   instruction: (
//     <p>
//       1. Rinse and drain the checkpeas.
//       <br />
//       2. Dice the cherry tomatoes, cucumber and red onion.
//       <br />
//       3. Combine all ingerdients in a large bowl.
//       <br />
//       4. Drizzle with olive oil and toss gently to combine.
//     </p>
//   ),
// };
