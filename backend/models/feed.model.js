import mongoose from "mongoose";

const feedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, 
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
    required: false,
  },
  type: {
    type: String,
    enum: [
      "Loan Approved",
      "Payment Due",
      "Collateral Liquidated",
      "Loan Defaulted",
      "Payment Received",
    ],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  }

});

export const Feed = mongoose.model("Feed", feedSchema);
