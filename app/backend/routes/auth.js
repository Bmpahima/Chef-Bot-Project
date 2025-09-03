import express from "express";

import { loginController, signupController } from "../controllers/auth.js";

const router = express.Router();

// POST => /login
router.post("/login", loginController);

// POST => /signup
router.post("/signup", signupController);

export default router;
