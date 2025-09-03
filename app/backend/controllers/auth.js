import bcrypt from "bcrypt";

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

    res.status(200).json({ message: "User logged in succesfully." });
  } catch (err) {
    next(err);
  }
};

export const signupController = async (req, res, next) => {
  try {
    const body = req.body;
    console.log(req.body);
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
