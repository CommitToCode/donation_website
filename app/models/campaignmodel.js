const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doner", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Campaign", campaignSchema);
