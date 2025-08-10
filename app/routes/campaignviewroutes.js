const express = require("express");
const router = express.Router();


const Campaign = require("../models/campaignmodel");
const Category = require("../models/categorymodel");
const { isAuthenticated } = require('../middleware/authenticate');

router.get("/",isAuthenticated, async (req, res) => {
  try {
    
    const campaigns = await Campaign.find()
      .populate("category", "name")
      .lean();

    
    const categories = await Category.find().lean();

  
    res.render("banner/campaigns", { campaigns, categories  , user: req.session.user || null,});
  } catch (error) {
    console.error("Error fetching campaigns page:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
