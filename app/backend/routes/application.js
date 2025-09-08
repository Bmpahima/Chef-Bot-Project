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
    cb(null, path.join(__dirname, "..", "images"));
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString + "-" + file.originalname);
  },
});

// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single());

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

export default router;
