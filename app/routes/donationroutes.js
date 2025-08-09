// 


const express = require("express");
const router = express.Router();
const { createDonationLink } = require("../controller/donationcontroller");

/**
 * @swagger
 * tags:
 *   name: Donations
 *   description: Donation creation, verification, listing
 */

/**
 * @swagger
 * /donations/create-donation:
 *   post:
 *     tags: [Donations]
 *     summary: Create donation and send Razorpay payment link via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               amount: { type: number }
 *               campaignId: { type: string }
 *     responses:
 *       200:
 *         description: Payment link created and emailed
 */
router.post("/create-donation", createDonationLink);

module.exports = router;
