import express, { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import {
  getDashboardController,
  getImageUploadController,
  getImageRecipeController,
  getManualRecipeController,
  getAIRecipeController,
  getAllRecipesController,
  postSaveRecipe,
  getRecipeById,
} from "../controllers/application.js";
import isAuth from "../middleware/is-auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images is allowed!", false));
  }
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "images", "uploaded"));
  },
  filename: (req, file, cb) => {
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^\w\-]+/g, "_");
    cb(null, `${ts}-${base}${ext}`);
  },
});

const router = express.Router();

// GET => /get-dashboard
router.get("/get-dashboard", isAuth, getDashboardController);

// POST => /image-upload
router.post(
  "/image-upload",
  isAuth,
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
  getImageUploadController
);

// POST => /image-generate
router.post("/image-generate", isAuth, getImageRecipeController);

// POST => /manual-generate
router.post("/manual-generate", isAuth, getManualRecipeController);

// POST => /ai-generate
router.post("/ai-generate", isAuth, getAIRecipeController);

// GET => /recipes-all
router.get("/recipes-all", isAuth, getAllRecipesController);

// POST => /save-recipe
router.post("/save-recipe", isAuth, postSaveRecipe);

// GET => /get-recipe/:id
router.get("/get-recipe/:id", isAuth, getRecipeById);

export default router;
