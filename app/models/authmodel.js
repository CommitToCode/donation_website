const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: String,
  otp: String,
  otpExpiresAt: Date,
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ["donor", "admin"], },
}, { timestamps: true });

module.exports = mongoose.model("Doner", userSchema);
