const Campaign = require("../models/campaignmodel");


exports.createCampaign = async (req, res) => {
  try {
    const image = req.file?.filename;
    const { title, description, goalAmount, category, creatorId, role } = req.body;

    const status = role === "admin" ? "approved" : "pending";

    const newCampaign = new Campaign({
      title,
      description,
      goalAmount,
      category,
      creatorId,
      image,
      status
    });

    await newCampaign.save();
    res.status(201).json({ message: `Campaign ${status === 'approved' ? 'created and approved' : 'submitted for approval'}`, campaign: newCampaign });
  } catch (error) {
    res.status(500).json({ message: "Campaign creation failed", error: error.message });
  }
};


exports.getAllCampaigns = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const campaigns = await Campaign.find(filter).populate("creatorId", "name email");
    res.json({ campaigns });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("creatorId", "name email");
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    res.json({ campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCampaign = async (req, res) => {
 try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    campaign.status = status;
    await campaign.save();

    res.json({ message: `Campaign ${status}`, campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    res.json({ message: "Campaign deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
