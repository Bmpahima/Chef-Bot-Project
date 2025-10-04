import mongoose from "mongoose";
import {
  CUISINE_ENUM,
  FLAVORS_ENUM,
  DIFFICULTY_ENUM,
} from "../util/constants.js";

const preferencesSchema = new mongoose.Schema(
  {
    cuisine: { type: [String], enum: CUISINE_ENUM, default: ["other"] },
    difficulty: { type: String, enum: DIFFICULTY_ENUM, default: "easy" },
    flavors: { type: [String], enum: FLAVORS_ENUM, default: ["comfort"] },
    vegetarian: { type: Boolean, default: false },
    kosher: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      default: "Master Chef",
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      required: true,
      default: "/static/media/profile-1.63a59e2c2259d740b518.png",
    },
    defaultPreferences: { type: preferencesSchema, default: () => ({}) },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
