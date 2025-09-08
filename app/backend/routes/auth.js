import express from "express";

import isAuth from "../middleware/is-auth.js";

import {
  loginController,
  signupController,
  meController,
} from "../controllers/auth.js";

const router = express.Router();

// POST => /login
router.post("/login", loginController);

// POST => /signup
router.post("/signup", signupController);

// GET => /me
router.get("/me", isAuth, meController);

export default router;
