import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ override: true });

import User from "../models/user.js";

export const loginController = async (req, res, next) => {
  try {
    const body = req.body;
    const email = body.email;
    const password = body.password;

    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User is not exist.");
      error.status = 404;
      next(error);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error("Password is incorrect.");
      error.status = 401;
      next(error);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "2h",
    });
    res.status(200).json({
      message: "User logged in succesfully.",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const signupController = async (req, res, next) => {
  try {
    const body = req.body;
    const username = body.username;
    const email = body.email;
    const password = body.password;

    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) {
      const error = new Error("Failed to hash password");
      error.status = 500;
      next(error);
    }

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User signed up succesfully." });
  } catch (err) {
    next(err);
  }
};

export const meController = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User is not exist.");
      error.status = 401;
      next(error);
    }

    res.status(200).json({
      message: "User authenticated.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};
