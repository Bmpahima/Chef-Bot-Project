import mongoose, { Schema } from "mongoose";

const CUISINE_ENUM = [
  "italian",
  "french",
  "american",
  "asian",
  "indian",
  "mexican",
  "middle-eastern",
  "mediterranean",
  "israeli",
  "other",
];

const ingredientSchema = new Schema({
  ingredientName: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  unit: {
    type: String,
    enum: ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "piece"],
    required: true,
  },
});

const DIFFICULTY_ENUM = ["easy", "medium", "hard"];

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

    cuisine: { type: String, enum: CUISINE_ENUM, default: "other" },
    difficulty: { type: String, enum: DIFFICULTY_ENUM, default: "easy" },

    servings: { type: Number, default: 1, min: 1 },
    prepTimeMinutes: { type: Number, default: 0, min: 0 },
    cookTimeMinutes: { type: Number, default: 0, min: 0 },

    sourceUrl: { type: String, trim: true },
    url: { type: String, trim: true },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
