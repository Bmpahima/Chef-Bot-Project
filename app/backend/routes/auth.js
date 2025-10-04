import express from "express";

import isAuth from "../middleware/is-auth.js";

import {
  loginController,
  signupController,
  meController,
  patchPasswordChangeController,
  patchEditProfileController,
  patchEditPreferencesController,
  postResetRequestController,
  postResetVerifyController,
  postResetCompleteController,
} from "../controllers/auth.js";

import { validate } from "../middleware/validate.js";

import * as validator from "../validators/auth.js";

const router = express.Router();

// POST => /login
router.post("/login", validate(validator.loginValidator), loginController);

// POST => /signup
router.post("/signup", validate(validator.signupValidator), signupController);

// GET => /me
router.get("/me", isAuth, meController);

// PATCH => /change-password
router.patch(
  "/change-password",
  isAuth,
  validate(validator.changePasswordValidator),
  patchPasswordChangeController
);

// PATCH => /edit-profile
router.patch(
  "/edit-profile",
  isAuth,
  validate(validator.editProfileValidator),
  patchEditProfileController
);

// PATCH => /edit-default-preferences
router.patch(
  "/edit-default-preferences",
  isAuth,
  validate(validator.editPreferencesValidator),
  patchEditPreferencesController
);

// POST => /reset/request
router.post(
  "/reset/request",
  validate(validator.resetRequestValidator),
  postResetRequestController
);

// POST => /reset/verify
router.post(
  "/reset/verify",
  validate(validator.resetVerifyValidator),
  postResetVerifyController
);

// POST => /reset/complete
router.post(
  "/reset/complete",
  validate(validator.resetCompleteValidator),
  postResetCompleteController
);

export default router;
