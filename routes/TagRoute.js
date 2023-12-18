const express = require("express");
const tagController = require("../controllers/tagController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

router.get("/tags", tagController.getTags);
router.post("/tags", authMiddleware, tagController.createTag);

module.exports = router;