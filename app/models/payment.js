const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: String,
  userEmail: String,
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  campaignTitle: String,
  amount: Number,
  method: String,
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
