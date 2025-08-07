const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  image: String,
  otp: String,
  otpExpiresAt: Date,
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Doner", userSchema);
