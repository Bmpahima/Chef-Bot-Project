import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from "./routes/auth.js";
import applicationRouter from "./routes/application.js";

const app = express();

dotenv.config({ override: true });

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/app", applicationRouter);

app.use((err, req, res, next) => {
  console.log(err);

  res.status(err.status || 500).json({
    error: err.message || "Something went wrong.",
  });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(8000, () => {
      console.log(
        "App is listening at port 8000 and connected to a MongoDB database."
      );
    });
  });
