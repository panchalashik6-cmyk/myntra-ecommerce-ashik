const express = require("express");
const {
    getProducts, getProductById, createProduct, updateProduct, deleteProduct,
    seedProducts, seedMoreProducts
} = require("../controller/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/seed", seedProducts);
router.post("/seed-more", seedMoreProducts);
router.get("/:id", getProductById);

router.post("/", authMiddleware, adminMiddleware, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
