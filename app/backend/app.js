import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./routes/auth.js";
import applicationRouter from "./routes/application.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config({ override: true });

app.use("/images", express.static(path.join(__dirname, "images")));

console.log(path.join(__dirname, "images"));

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/app", applicationRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong.",
  });
});

mongoose.connect(`${process.env.MONGODB_URI}`).then(() => {
  app.listen(8000, () => {
    console.log(
      "App is listening at port 8000 and connected to a MongoDB database."
    );
  });
});
