import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  account: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  photos: [{
    type: String
  }],
  icon: {
    type: String,
    default: ""
  },
  bgGradient: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
