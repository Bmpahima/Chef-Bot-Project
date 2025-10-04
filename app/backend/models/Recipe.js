import mongoose, { Schema } from "mongoose";
import {
  CUISINE_ENUM,
  FLAVORS_ENUM,
  UNIT_ENUM,
  DIFFICULTY_ENUM,
} from "../util/constants.js";

const ingredientSchema = new Schema({
  ingredientName: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  unit: {
    type: String,
    enum: UNIT_ENUM,
    required: true,
  },
});

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    ingredients: { type: [ingredientSchema] },

    instructions: {
      type: String,
      required: true,
      trim: true,
    },

    vegetarian: {
      type: Boolean,
      default: false,
    },

    kosher: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cuisine: { type: [String], enum: CUISINE_ENUM, default: ["other"] },
    difficulty: { type: String, enum: DIFFICULTY_ENUM, default: "easy" },
    flavors: { type: [String], enum: FLAVORS_ENUM, default: "" },

    servings: { type: Number, default: 1, min: 1 },
    prepTimeMinutes: { type: String, default: "0 min" },
    cookTimeMinutes: { type: String, default: "0 min" },

    sourceUrl: { type: String, trim: true },
    url: { type: String, trim: true },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
