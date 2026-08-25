const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getCategories, createCategory, deleteCategory } = require("../controller/categoryController");

const router = express.Router();

router.get("/", getCategories);
router.post("/", authMiddleware, adminMiddleware, createCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
