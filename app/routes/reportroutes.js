// 

const express = require("express");
const router = express.Router();
const { generateReport } = require("../controller/reportcontroller");

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report generation and email
 */

/**
 * @swagger
 * /reports/generate-report:
 *   post:
 *     tags: [Reports]
 *     summary: Generate donation report HTML and send via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               reportDetails: { type: string }
 *     responses:
 *       200:
 *         description: Report generated and email sent
 */
router.post("/generate-report", generateReport);

module.exports = router;
