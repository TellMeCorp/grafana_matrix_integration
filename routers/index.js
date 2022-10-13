const express = require("express");
const router = express.Router();
const jose = require("node-jose");
const fs = require("fs");
const path = require("path");
const ks = fs.readFileSync(path.join(__dirname, "../src/Keys.json"));
const { register, login, tokenVerify, loguot } = require("../controllers/jwt");
const asyncHandler = require("express-async-handler");

router.get(
  "/jwks",
  asyncHandler(async (req, res) => {
    const keyStore = await jose.JWK.asKeyStore(ks.toString());
    res.send(keyStore.toJSON());
  })
);

router.post("/login", login);
router.post("/verify", tokenVerify);

module.exports = router;
