import mongoose from "mongoose";

const resetCodeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      index: true,
      required: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    used: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

const ResetCode = mongoose.model("ResetCode", resetCodeSchema);
export default ResetCode;
