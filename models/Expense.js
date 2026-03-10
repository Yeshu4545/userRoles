const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  title: { type: String, required: true },
  category: String,
  amount: { type: Number, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
