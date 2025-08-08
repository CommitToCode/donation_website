const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const campaignCtrl = require("../controller/campaigncontroller");

// Create campaign
router.post("/create", upload.single("image"), campaignCtrl.createCampaign);

// All campaigns
router.get("/", campaignCtrl.getAllCampaigns);

// Single campaign
router.get("/:id", campaignCtrl.getCampaignById);

// Update campaign
router.put("/:id", upload.single("image"), campaignCtrl.updateCampaign);

// Delete campaign
router.delete("/:id", campaignCtrl.deleteCampaign);
router.patch("/status/:id",campaignCtrl.updateCampaign);

module.exports = router;
