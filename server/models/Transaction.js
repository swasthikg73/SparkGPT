import mongoose from "mongoose";

const transcationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: { type: String, required: true },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    isPaid: { type: Boolean, required: false },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transcationSchema);

export default Transaction;
