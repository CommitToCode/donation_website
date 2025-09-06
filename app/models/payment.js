const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: String,
  userEmail: String,
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  campaignTitle: String,
  amount: Number,
  method: String,
      status: { type: String, enum: ["pending", "success"], default: "pending" }, 


}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
