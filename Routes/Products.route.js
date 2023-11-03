const express = require("express");
const router = express.Router();
const productController = require('../Controllers/Product.controller')

// adding product
router.post("/", productController.add);

// getting products
router.get("/", productController.getAll);

module.exports = router;
