const express = require("express");
const router = express.Router();
const { register, login, tokenVerify, loguot } = require("../controllers/jwt");

router.post("/login", login);

router.post("/verify", tokenVerify);

module.exports = router;
