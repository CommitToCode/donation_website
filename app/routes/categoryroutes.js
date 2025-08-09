// 



const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categorycontroller");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Campaign categories
 */

/**
 * @swagger
 * /categories/create:
 *   post:
 *     tags: [Categories]
 *     summary: Create category
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *     responses:
 *       201:
 *         description: Category created
 */
router.post("/create", categoryController.createCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", categoryController.getAllCategories);

module.exports = router;
