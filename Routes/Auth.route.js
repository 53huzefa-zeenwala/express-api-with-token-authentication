const express = require("express");
const {register, login, logout, refreshToken, update, get} = require('../Controllers/Auth.controller');
const { verifyAdminAccessToken } = require("../helpers/jwt_helper");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh-token", refreshToken);

router.delete("/logout", logout);

router.put('/update', verifyAdminAccessToken, update)

router.get('/users', verifyAdminAccessToken, get)

module.exports = router;
