// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");
// const campaignCtrl = require("../controller/campaigncontroller");


// router.post("/create", upload.single("image"), campaignCtrl.createCampaign);


// router.get("/", campaignCtrl.getAllCampaigns);


// router.get("/:id", campaignCtrl.getCampaignById);


// router.put("/:id", upload.single("image"), campaignCtrl.updateCampaign);


// router.delete("/:id", campaignCtrl.deleteCampaign);
// router.patch("/status/:id",campaignCtrl.updateCampaign);

// module.exports = router;











const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const campaignCtrl = require("../controller/campaigncontroller");

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Campaign CRUD, approvals, retrieval
 */

/**
 * @swagger
 * /campaigns/create:
 *   post:
 *     tags: [Campaigns]
 *     summary: Create a campaign (with image)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               goalAmount:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Campaign created (pending)
 */
router.post("/create", upload.single("image"), campaignCtrl.createCampaign);

/**
 * @swagger
 * /campaigns:
 *   get:
 *     tags: [Campaigns]
 *     summary: Get all campaigns (optional filters via query)
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of campaigns
 */
router.get("/", campaignCtrl.getAllCampaigns);

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     tags: [Campaigns]
 *     summary: Get campaign by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Campaign data
 */
router.get("/:id", campaignCtrl.getCampaignById);

/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     tags: [Campaigns]
 *     summary: Update campaign (creator or admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               goalAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Campaign updated
 */
router.put("/:id", upload.single("image"), campaignCtrl.updateCampaign);

/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     tags: [Campaigns]
 *     summary: Delete a campaign
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Campaign deleted
 */
router.delete("/:id", campaignCtrl.deleteCampaign);

/**
 * @swagger
 * /campaigns/status/{id}:
 *   patch:
 *     tags: [Campaigns]
 *     summary: Update campaign status (approve/reject) - Admin only
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch("/status/:id", campaignCtrl.updateCampaign);

module.exports = router;
