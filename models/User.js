const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["superadmin", "vendor", "admin", "user"],
    default: "user"
  },

  // For vendor accounts
  status: {
    type: String,
    enum: ["pending", "active", "deactivated"],
    default: "pending"
  },

  company: {
    name: String,
    address: String,
    phone: String
  },

  subscription: {
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", default: null },
    expiresAt: { type: Date, default: null }
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);