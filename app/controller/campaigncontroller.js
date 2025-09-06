const Campaign = require("../models/campaignmodel");
const Category = require("../models/categorymodel"); 

const Payment = require("../models/payment"); 

exports.createCampaign = async (req, res) => {
  try {
    const image = req.file?.filename;
    const { title, description, goalAmount, category } = req.body;

  
    const creatorId = req.session.user?.id;
    const role = req.session.user?.role;

    if (!creatorId) {
      return res.status(401).send("Unauthorized: Please log in to create campaigns");
    }

    
    const status = role === "admin" ? "approved" : "pending";

    const newCampaign = new Campaign({
      title,
      description,
      goalAmount,
      category,
      creatorId,
      image,
      status,
            raisedAmount: 0, 

    });

    await newCampaign.save();

    res.redirect("/campaigns");
  } catch (error) {
    res.status(500).send("Campaign creation failed: " + error.message);
  }
};

// exports.getAllCampaigns = async (req, res) => {
//   try {
//     const filter = {};
//     if (req.query.status) filter.status = req.query.status;
//     if (req.query.category) filter.category = req.query.category;

//     const campaigns = await Campaign.find(filter).populate("creatorId", "name email");
//     res.json({ campaigns });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


exports.getAllCampaigns = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    
    const campaigns = await Campaign.find(filter)
      .populate("category", "name")
      .lean();
    res.json({ campaigns });

  
    for (let c of campaigns) {
      const payments = await Payment.find({
        campaignId: mongoose.Types.ObjectId(c._id),
        status: "success" 
      });
      const totalRaised = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
      c.raisedAmount = totalRaised;
      

      await Campaign.findByIdAndUpdate(c._id, { raisedAmount: totalRaised });
    }

    const categories = await Category.find().lean();
    res.render("banner/campaigns", { title: "Campaigns", campaigns, categories });
  } catch (error) {
    console.error(error);
    res.render("banner/campaigns", { title: "Campaigns", campaigns: [], categories: [] });
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





exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("creatorId", "name email")
      .lean();

    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const payments = await Payment.find({ campaignId: campaign._id, status: "success" });
    campaign.raisedAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({ campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).send("Campaign not found");

    const { title, description, goalAmount, category, status } = req.body;
    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (goalAmount) campaign.goalAmount = goalAmount;
    if (category) campaign.category = category;
    if (status && ["pending", "approved", "rejected"].includes(status)) campaign.status = status;

    if (req.file?.filename) {
      campaign.image = req.file.filename;
    }

    await campaign.save();

    
    res.redirect("/campaigns");
  } catch (error) {
    res.status(500).send(error.message);
  }
};


exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    // For API, send JSON:
    // res.json({ message: "Campaign deleted" });

    
    res.redirect("/campaigns");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
