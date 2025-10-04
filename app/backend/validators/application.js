import { body, param, query } from "express-validator";

export const imageOrManualRecipeValidator = [
  body("ingredients")
    .exists()
    .withMessage("Ingredients are missing.")
    .bail()
    .isArray({ min: 1, max: 50 })
    .withMessage("Ingredients must be an array (1-50)."),

  body("ingredients.*")
    .isString()
    .withMessage("each ingredient must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("ingredient cannot be empty."),

  body("constraints")
    .exists()
    .withMessage("Constraints are missing.")
    .bail()
    .isObject()
    .withMessage("Constraints must be an object."),
  body("constraints.difficulty")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(["easy", "medium", "hard"])
    .withMessage('difficulty must be "easy" | "medium" | "hard".'),
  body("constraints.kosher")
    .optional({ nullable: true })
    .isBoolean()
    .withMessage("kosher must be boolean.")
    .toBoolean(),
  body("constraints.vegetarian")
    .optional({ nullable: true })
    .isBoolean()
    .withMessage("vegetarian must be boolean.")
    .toBoolean(),
  body("constraints.cuisine")
    .optional({ nullable: true })
    .isArray({ max: 10 })
    .withMessage("cuisine must be an array (max 10)."),
  body("constraints.cuisine.*")
    .optional()
    .isString()
    .withMessage("cuisine item must be a string.")
    .trim()
    .isLength({ min: 2, max: 24 })
    .withMessage("cuisine item must be 2-24 chars."),
  body("constraints.flavors")
    .optional({ nullable: true })
    .isArray({ max: 10 })
    .withMessage("flavors must be an array (max 10)."),
  body("constraints.flavors.*")
    .optional()
    .isString()
    .withMessage("flavor item must be a string.")
    .trim()
    .isLength({ min: 2, max: 24 })
    .withMessage("flavor item must be 2-24 chars."),
];

export const aiRecipeValidator = [
  body("constraints")
    .exists()
    .withMessage("Constraints are missing.")
    .bail()
    .isObject()
    .withMessage("Constraints must be an object."),
  body("constraints.difficulty")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(["easy", "medium", "hard"])
    .withMessage('difficulty must be "easy" | "medium" | "hard".'),
  body("constraints.kosher")
    .optional({ nullable: true })
    .isBoolean()
    .withMessage("kosher must be boolean.")
    .toBoolean(),
  body("constraints.vegetarian")
    .optional({ nullable: true })
    .isBoolean()
    .withMessage("vegetarian must be boolean.")
    .toBoolean(),
  body("constraints.cuisine")
    .optional({ nullable: true })
    .isArray({ max: 10 })
    .withMessage("cuisine must be an array (max 10)."),
  body("constraints.cuisine.*")
    .optional()
    .isString()
    .withMessage("cuisine item must be a string.")
    .trim()
    .isLength({ min: 2, max: 24 })
    .withMessage("cuisine item must be 2-24 chars."),
  body("constraints.flavors")
    .optional({ nullable: true })
    .isArray({ max: 10 })
    .withMessage("flavors must be an array (max 10)."),
  body("constraints.flavors.*")
    .optional()
    .isString()
    .withMessage("flavor item must be a string.")
    .trim()
    .isLength({ min: 2, max: 24 })
    .withMessage("flavor item must be 2-24 chars."),
];

export const allRecipeValidator = [
  query("page")
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("Invalid page.")
    .toInt(),
  query("limit")
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 })
    .withMessage("Invalid limit (1-100).")
    .toInt(),
];

export const saveRecipeValidator = [
  body("recipe")
    .exists()
    .withMessage("Recipe is missing.")
    .bail()
    .isObject()
    .withMessage("Invalid recipe object."),

  body("recipe.name")
    .exists()
    .withMessage("name is required.")
    .bail()
    .isString()
    .withMessage("name must be a string.")
    .bail()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("name must be 2-80 chars."),

  body("recipe.ingredients")
    .exists()
    .withMessage("ingredients are required.")
    .bail()
    .isArray({ min: 1, max: 100 })
    .withMessage("ingredients must be an array (1-100)."),
  body("recipe.ingredients.*")
    .isObject()
    .withMessage("each ingredient must be a object.")
    .bail()
    .notEmpty()
    .withMessage("ingredient cannot be empty."),

  body("recipe.instructions")
    .exists()
    .withMessage("instructions are required.")
    .isString()
    .withMessage("each instruction must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("instruction cannot be empty.")
    .isLength({ max: 2000 })
    .withMessage("instruction too long"),

  body("recipe.vegetarian")
    .optional({ nullable: true })
    .isBoolean()
    .withMessage("vegetarian must be boolean.")
    .toBoolean(),
  body("recipe.kosher")
    .optional({ nullable: true })
    .isBoolean()
    .withMessage("kosher must be boolean.")
    .toBoolean(),
  body("recipe.cuisine")
    .optional({ nullable: true })
    .isArray({ max: 10 })
    .withMessage("cuisine must be an array (max 10)."),
  body("recipe.cuisine.*")
    .optional()
    .isString()
    .withMessage("cuisine item must be a string.")
    .bail()
    .trim()
    .isLength({ min: 2, max: 24 })
    .withMessage("cuisine 2-24 chars"),
  body("recipe.flavors")
    .optional({ nullable: true })
    .isArray({ max: 10 })
    .withMessage("flavors must be an array (max 10)."),
  body("recipe.flavors.*")
    .optional()
    .isString()
    .withMessage("flavor item must be a string.")
    .bail()
    .trim()
    .isLength({ min: 2, max: 24 })
    .withMessage("flavor 2-24 chars"),
  body("recipe.difficulty")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(["easy", "medium", "hard"])
    .withMessage('difficulty must be "easy" | "medium" | "hard".'),
  body("recipe.servings")
    .optional({ nullable: true })
    .isInt({ min: 1, max: 50 })
    .withMessage("servings 1-50")
    .toInt(),
  body("recipe.prepTime").optional({ nullable: true }),
  body("recipe.cookTime").optional({ nullable: true }),
  body("recipe.sourceUrl")
    .optional({ nullable: true, checkFalsy: true })
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Invalid sourceUrl."),
];

export const recipeByIdValidator = [
  param("id")
    .exists()
    .withMessage("Recipe identifier must be entered.")
    .bail()
    .isString()
    .withMessage("Recipe id must be a string.")
    .bail()
    .trim()
    .isMongoId()
    .withMessage("Invalid recipe id."),
];

export const deleteRecipeByIdValidator = [
  param("id")
    .exists()
    .withMessage("Recipe identifier must be entered.")
    .bail()
    .isString()
    .withMessage("Recipe id must be a string.")
    .bail()
    .trim()
    .isMongoId()
    .withMessage("Invalid recipe id."),
];

export const editRecipeValidator = [
  body("updatedRecipe")
    .exists()
    .withMessage("Recipe is missing.")
    .bail()
    .isObject()
    .withMessage("Invalid recipe object."),

  body("updatedRecipe._id")
    .exists()
    .withMessage("Recipe id is required.")
    .bail()
    .isMongoId()
    .withMessage("Invalid recipe id."),

  body("updatedRecipe.name")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("name must be a string.")
    .bail()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("name must be 2-80 chars."),

  body("updatedRecipe.cuisine")
    .optional({ nullable: true })
    .isArray({ max: 10 })
    .withMessage("cuisine must be an array (max 10)."),
  body("updatedRecipe.cuisine.*")
    .optional()
    .isString()
    .withMessage("cuisine item must be a string.")
    .bail()
    .trim()
    .isLength({ min: 2, max: 24 })
    .withMessage("cuisine 2-24 chars."),

  body("updatedRecipe.flavors")
    .optional({ nullable: true })
    .isArray({ max: 10 })
    .withMessage("flavors must be an array (max 10)."),
  body("updatedRecipe.flavors.*")
    .optional()
    .isString()
    .withMessage("flavor item must be a string.")
    .bail()
    .trim()
    .isLength({ min: 2, max: 24 })
    .withMessage("flavor 2-24 chars."),

  body("updatedRecipe.ingredients")
    .optional({ nullable: true })
    .isArray({ min: 1, max: 200 })
    .withMessage("ingredients must be an array (1-200)."),
  body("updatedRecipe.ingredients.*")
    .optional()
    .isObject()
    .withMessage("Ingredient format is invalid.")
    .bail()
    .notEmpty()
    .withMessage("ingredient cannot be empty."),
  body("updatedRecipe.instructions")
    .optional()
    .isString()
    .withMessage("instruction must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("instruction cannot be empty.")
    .isLength({ max: 2000 })
    .withMessage("instruction too long."),

  body("updatedRecipe.kosher")
    .optional({ nullable: true })
    .isBoolean()
    .withMessage("kosher must be boolean.")
    .toBoolean(),

  body("updatedRecipe.vegetarian")
    .optional({ nullable: true })
    .isBoolean()
    .withMessage("vegetarian must be boolean.")
    .toBoolean(),

  body("updatedRecipe.difficulty")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(["easy", "medium", "hard"])
    .withMessage('difficulty must be "easy" | "medium" | "hard".'),

  body("updatedRecipe.servings")
    .optional({ nullable: true })
    .isInt({ min: 1, max: 50 })
    .withMessage("servings must be 1-50.")
    .toInt(),

  body("updatedRecipe.prepTimeMinutes").optional({ nullable: true }),

  body("updatedRecipe.cookTimeMinutes").optional({ nullable: true }),
];
