const express = require("express");
const categoryController = require("../controllers/categoryController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

router.get("/categories", categoryController.getCategories);
router.post("/categories", authMiddleware, categoryController.createCategory);

module.exports = router;