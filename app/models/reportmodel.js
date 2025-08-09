const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin
  reportType: { type: String, enum: ["fraud-check", "donation-summary"] },
  findings: String
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
