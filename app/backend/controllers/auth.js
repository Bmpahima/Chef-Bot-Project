import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "node:crypto";

dotenv.config({ override: true });

import User from "../models/user.js";
import ResetCode from "../models/resetCode.js";
import ResetTicket from "../models/resetTicket.js";

import { sendMail } from "../services/sendgrid.js";

const sha256 = (s) =>
  crypto.createHash("sha256").update(String(s)).digest("hex");

function generateNumericCode(len = 6) {
  const n = crypto.randomInt(0, 10 ** len);
  return String(n).padStart(len, "0");
}

function generateRawTicket(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export const loginController = async (req, res, next) => {
  try {
    const email = req.validated.email;
    const password = req.validated.password;

    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User is not exist.");
      error.status = 404;
      return next(error);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error("Password is incorrect.");
      error.status = 401;
      return next(error);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "2h",
    });
    return res.status(200).json({
      message: "User logged in succesfully.",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImg: user.profileImg || "",
        fullName: user.fullName || "Master Chef",
        defaultPreferences: user.defaultPreferences,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const signupController = async (req, res, next) => {
  try {
    const body = req.body;
    const username = body.username;
    const email = body.email.trim().toLowerCase();
    const password = body.password;
    const profileImg = body.imageUrl.trim();

    const [existsByUsername, existsByEmail] = await Promise.all([
      User.findOne({ username: username }),
      User.findOne({ email: email }),
    ]);
    if (existsByUsername || existsByEmail) {
      const err = new Error(
        `${
          existsByEmail ? "E-mail" : "Username"
        } already exists, please try another.`
      );
      err.status = 400;
      return next(err);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) {
      const error = new Error("Failed to hash password");
      error.status = 500;
      return next(error);
    }

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      profileImg: profileImg,
    });
    try {
      await newUser.save();
    } catch (err) {
      err.status = 400;
      return next(err);
    }

    res.status(201).json({ message: "User signed up succesfully." });
  } catch (err) {
    return next(err);
  }
};

export const meController = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User is not exist.");
      error.status = 401;
      return next(error);
    }

    return res.status(200).json({
      message: "User authenticated.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImg: user.profileImg,
        fullName: user.fullName || "Master Chef",
        defaultPreferences: user.defaultPreferences,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const patchPasswordChangeController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select("password");
    console.log(user);
    if (!user) {
      const error = new Error("User's not found.");
      error.status = 404;
      return next(error);
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      const error = new Error("Incorrect password.");
      error.status = 401;
      return next(error);
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(newPassword, 12);
    } catch (error) {
      error.message = "Failed to hash your password: " + error.message;
      return next(error);
    }

    const u = await User.updateOne(
      { _id: userId },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    if (u.matchedCount === 0) {
      const err = new Error(
        "Failed to change yout password. Please try again later."
      );
      err.status = 404;
      return next(err);
    }

    return res.status(201).json({ message: "Password changed succesfully" });
  } catch (error) {
    return next(error);
  }
};

export const patchEditProfileController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { fullName, email, username } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User's not found.");
      error.status = 404;
      return next(error);
    }

    const [existsByUsername, existsByEmail] = await Promise.all([
      User.findOne({ username: username, _id: { $ne: req.userId } }),
      User.findOne({ email: email, _id: { $ne: req.userId } }),
    ]);
    if (existsByUsername || existsByEmail) {
      const err = new Error(
        `${
          existsByEmail ? "E-mail" : "Username"
        } already exists, please try another.`
      );
      err.status = 422;
      return next(err);
    }

    const u = await User.updateOne(
      { _id: userId },
      {
        $set: {
          email: email || user.email,
          fullName: fullName,
          username: username || user.username,
        },
      }
    );

    if (u.matchedCount === 0) {
      const err = new Error(
        "Failed to change your password. Please try again later."
      );
      err.status = 404;
      return next(err);
    }
    return res.status(201).json({
      message: "Password changed succesfully",
      updated: {
        email,
        username,
        fullName,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const patchEditPreferencesController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { prefs } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User's not found.");
      error.status = 404;
      return next(error);
    }

    const formattedData = {
      cuisine: prefs.cuisine,
      flavors: prefs.flavors,
      difficulty: prefs.difficulty,
      kosher: prefs.diet.includes("kosher"),
      vegetarian: prefs.diet.includes("vegetarian"),
    };

    const u = await User.updateOne(
      { _id: userId },
      {
        $set: {
          defaultPreferences: formattedData,
        },
      }
    );

    if (u.matchedCount === 0) {
      const err = new Error(
        "Failed to change your default preferences. Please try again later."
      );
      err.status = 404;
      return next(err);
    }
    return res.status(201).json({
      message: "Preferences changed succesfully",
      updated: prefs,
    });
  } catch (error) {
    return next(error);
  }
};

export const postResetRequestController = async (req, res, next) => {
  const email = (req.body.email || "").trim().toLowerCase();

  try {
    if (!email) {
      const err = new Error("Invalid email entered.");
      err.status = 400;
      return next(err);
    }

    const user = await User.findOne({ email: email }).lean();
    if (!user) {
      const err = new Error("User with that email is not exists.");
      err.status = 400;
      return next(err);
    }

    await ResetCode.updateMany(
      { userId: user._id, used: false },
      { $set: { used: true } }
    );

    const rawCode = generateNumericCode(6);
    const codeHash = sha256(rawCode);
    const ttlMs = 15 * 60 * 1000;

    await ResetCode.create({
      userId: user._id,
      codeHash: codeHash,
      used: false,
      expiresAt: new Date(Date.now() + ttlMs),
    });

    try {
      const m = await sendMail({
        to: email,
        from: process.env.SENDGRID_SENDER,
        subject: "Your reset code",
        text: `Use this code to reset your password: ${rawCode} (valid for 15 minutes)`,
        html: `<p>Your code:</p>
             <p style="font-size:20px; letter-spacing:3px;"><b>${rawCode}</b></p>
             <p>Valid for 15 minutes.</p>`,
      });
      console.log(m);
    } catch (error) {
      err.status = 500;
      return next(err);
    }

    res.status(200).json({ message: "Reset code has been sent to email." });
  } catch (error) {
    return next(error);
  }
};

export const postResetVerifyController = async (req, res, next) => {
  try {
    const email = (req.body.email ?? "").toString().trim().toLowerCase();
    const code = (req.body.code || "").toString().trim();

    const user = await User.findOne({ email: email }).lean();
    if (!user) {
      const err = new Error("User with that email is not exists.");
      err.status = 400;
      return next(err);
    }

    const doc = await ResetCode.findOne({ userId: user._id, used: false }).sort(
      { createdAt: -1 }
    );

    if (
      !doc ||
      doc.expiresAt <= new Date() ||
      (doc.attempts ?? 0) >= (doc.maxAttempts ?? 5)
    ) {
      const err = new Error("Code is expired.");
      err.status = 400;
      return next(err);
    }

    if (sha256(code) !== doc.codeHash) {
      await ResetCode.updateOne({ _id: doc._id }, { $inc: { attempts: 1 } });
      const err = new Error("Code is invalid.");
      err.status = 400;
      return next(err);
    }

    await ResetCode.updateOne({ _id: doc._id }, { $set: { used: true } });

    const rawTicket = generateRawTicket(32);
    const tokenHash = sha256(rawTicket);
    const ttlMs = 10 * 60 * 1000;

    await ResetTicket.create({
      userId: user._id,
      tokenHash: tokenHash,
      used: false,
      expiresAt: new Date(Date.now() + ttlMs),
    });

    return res.status(200).json({
      message: "Code is valid, reset ticket has been sent.",
      ticket: rawTicket,
      uid: String(user._id),
    });
  } catch (error) {
    return next(error);
  }
};

export const postResetCompleteController = async (req, res, next) => {
  try {
    const { ticket, uid, newPassword } = req.body || {};
    if (!ticket || !uid || !newPassword) {
      const err = new Error("Bad input.");
      err.status = 400;
      return next(err);
    }

    const t = await ResetTicket.findOne({ userId: uid, used: false }).sort({
      createdAt: -1,
    });
    if (!t || t.expiresAt <= new Date()) {
      const err = new Error("Ticket is expired.");
      err.status = 400;
      return next(err);
    }

    if (sha256(String(ticket)) !== t.tokenHash) {
      const err = new Error("Reset ticket is invalid.");
      err.status = 400;
      return next(err);
    }

    const user = await User.findById(uid);
    if (!user) {
      const err = new Error("No such user.");
      err.status = 400;
      return next(err);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    if (!hashedPassword) {
      const error = new Error("Failed to hash password");
      error.status = 500;
      return next(error);
    }
    user.password = hashedPassword;
    await user.save();

    t.used = true;
    t.expiresAt = new Date();
    await t.save();

    return res
      .status(200)
      .json({ message: "Password has been resetted succesfully." });
  } catch (error) {
    return next(error);
  }
};
