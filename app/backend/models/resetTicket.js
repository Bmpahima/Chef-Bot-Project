import mongoose from "mongoose";

const resetTicketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      index: true,
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ResetTicket = mongoose.model("ResetTicket", resetTicketSchema);
export default ResetTicket;
