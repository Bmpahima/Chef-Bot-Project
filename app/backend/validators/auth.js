import { body, param } from "express-validator";
import User from "../models/user.js";

export const loginValidator = [
  body("email")
    .exists()
    .withMessage("Email must be entered.")
    .bail()
    .isString()
    .withMessage("Email must be a string.")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Email is invalid.")
    .bail()
    .normalizeEmail(),
  body("password")
    .exists()
    .withMessage("Password must be entered.")
    .bail()
    .isString()
    .withMessage("Password must be a string.")
    .bail()
    .isLength({ min: 8, max: 50 })
    .withMessage("Password must have a length between 8 to 50 characters."),
];

export const signupValidator = [
  body("email")
    .exists()
    .withMessage("Email must be entered.")
    .bail()
    .isString()
    .withMessage("Email must be a string.")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Email is invalid.")
    .bail()
    .normalizeEmail(),
  body("username")
    .exists()
    .withMessage("Username must be entered.")
    .bail()
    .isString()
    .withMessage("Username must be a string.")
    .bail()
    .trim()
    .isLength({ min: 3, max: 24 })
    .withMessage("Username must be 3-24 chars.")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Username can contain letters, numbers, and underscores only."
    ),
  body("password")
    .exists()
    .withMessage("Password must be entered.")
    .bail()
    .isString()
    .withMessage("Password must be a string.")
    .bail()
    .isLength({ min: 8, max: 50 })
    .withMessage("Password must have a length between 8 to 50 characters."),
  body("profileImg")
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage("Invalid URL."),
];

export const changePasswordValidator = [
  body("currentPassword")
    .exists()
    .withMessage("Current password must be entered.")
    .bail()
    .isString()
    .withMessage("Current password must be a string.")
    .bail()
    .notEmpty()
    .withMessage("Current password must have a value.")
    .bail()
    .isLength({ min: 8, max: 50 })
    .withMessage("Current password length must be 8-50."),

  body("newPassword")
    .exists()
    .withMessage("New password must be entered.")
    .bail()
    .isString()
    .withMessage("New password must be a string.")
    .bail()
    .notEmpty()
    .withMessage("New password must have a value.")
    .bail()
    .isLength({ min: 8, max: 50 })
    .withMessage("New password length must be 8-50."),
];

export const editProfileValidator = [
  body("fullName")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("Name must be a string.")
    .bail()
    .trim()
    .isLength({ max: 80 })
    .withMessage("Name must be at most 80 characters.")
    .bail()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Name cannot contains non alpha characters."),
  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("Email must be a string.")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Email is invalid.")
    .bail()
    .normalizeEmail(),
  body("username")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("Username must be a string.")
    .bail()
    .trim()
    .isLength({ min: 3, max: 24 })
    .withMessage("Username must be 3-24 characters.")
    .bail()
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Username can contain letters, numbers, and underscores only."
    ),
];

export const editPreferencesValidator = [
  body("prefs")
    .exists()
    .withMessage("prefs is required.")
    .bail()
    .isObject()
    .withMessage("prefs must be an object."),
  body("prefs.cuisine")
    .optional({ nullable: true })
    .isArray({ max: 8 })
    .withMessage("cuisine must be an array up to 8 items."),
  body("prefs.cuisine.*")
    .optional()
    .isString()
    .withMessage("each cuisine must be a string.")
    .bail()
    .trim()
    .isLength({ min: 2, max: 24 })
    .withMessage("cuisine must be 2-24 chars.")
    .matches(/^[\p{L}\s.'-]+$/u)
    .withMessage("invalid cuisine characters.")
    .custom((v) => {
      if (v.includes("$") || v.includes("."))
        throw new Error("invalid characters.");
      return true;
    }),
  body("prefs.flavors")
    .optional({ nullable: true })
    .isArray({ max: 8 })
    .withMessage("flavors must be an array up to 8 items."),
  body("prefs.flavors.*")
    .optional()
    .isString()
    .withMessage("each flavor must be a string.")
    .bail()
    .trim()
    .isLength({ min: 2, max: 24 })
    .withMessage("flavor must be 2-24 chars.")
    .matches(/^[\w\s-]+$/)
    .withMessage("invalid flavor characters.")
    .custom((v) => {
      if (v.includes("$") || v.includes("."))
        throw new Error("invalid characters.");
      return true;
    }),
  body("prefs.difficulty")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(["easy", "medium", "hard"])
    .withMessage('difficulty must be "easy" | "medium" | "hard".'),
  body("prefs.diet")
    .optional({ nullable: true })
    .isArray({ max: 5 })
    .withMessage("diet must be an array."),
  body("prefs.diet.*")
    .optional()
    .isString()
    .withMessage("diet items must be strings.")
    .bail()
    .trim()
    .toLowerCase()
    .isIn(["kosher", "vegetarian"])
    .withMessage('diet can include only "kosher" or "vegetarian".'),
  body("prefs").custom((prefs) => {
    const allowed = new Set(["cuisine", "flavors", "difficulty", "diet"]);
    for (const k of Object.keys(prefs)) {
      if (!allowed.has(k)) throw new Error(`unknown field prefs.${k}`);
    }
    return true;
  }),
];

export const resetRequestValidator = [
  body("email")
    .exists()
    .withMessage("Email must be entered.")
    .bail()
    .isString()
    .withMessage("Email must be a string.")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Email is invalid.")
    .bail()
    .normalizeEmail(),
];

export const resetVerifyValidator = [
  body("email")
    .exists()
    .withMessage("Email must be entered.")
    .bail()
    .isString()
    .withMessage("Email must be a string.")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Email is invalid.")
    .bail()
    .normalizeEmail(),

  body("code")
    .exists()
    .withMessage("Code must be entered.")
    .bail()
    .isString()
    .withMessage("Code must be a string.")
    .bail()
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("Code must be 6 digits.")
    .isNumeric()
    .withMessage("Code must contain only numbers."),
];

export const resetCompleteValidator = [
  body("uid")
    .exists()
    .withMessage("uid must be provided.")
    .bail()
    .isString()
    .withMessage("uid must be a string.")
    .bail()
    .isMongoId()
    .withMessage("uid must be a valid MongoId."),

  body("ticket")
    .exists()
    .withMessage("ticket must be provided.")
    .bail()
    .isString()
    .withMessage("ticket must be a string.")
    .bail()
    .trim(),
  body("newPassword")
    .exists()
    .withMessage("Password must be entered.")
    .bail()
    .isString()
    .withMessage("Password must be a string.")
    .bail()
    .isLength({ min: 8, max: 50 })
    .withMessage("Password must have a length between 8 to 50 characters."),
];
