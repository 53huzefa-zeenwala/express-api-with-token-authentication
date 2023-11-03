const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/Order.controller")
const {verifyAccessToken} = require('../helpers/jwt_helper')

// route
router.post("/", verifyAccessToken, orderController.add);

router.get("/", verifyAccessToken, orderController.getAll);

module.exports = router;
