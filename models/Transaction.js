const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  type: { type: String, enum: ["invoice", "payment"], default: "invoice" },
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  description: String,
  metadata: Object
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
