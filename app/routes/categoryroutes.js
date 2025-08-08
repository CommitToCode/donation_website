const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categorycontroller");

router.post("/create", categoryController.createCategory);
router.get("/", categoryController.getAllCategories);

module.exports = router;
