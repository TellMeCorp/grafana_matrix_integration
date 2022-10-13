const express = require("express");
const router = express.Router();
const { register, login, tokenVerify, loguot } = require("../controllers/jwt");

router.get("/jwks", async (req, res) => {
  const jose = require("node-jose");
  const fs = require("fs");
  const path = require("path");
  const ks = fs.readFileSync(path.join(__dirname, "../src/Keys.json"));
  const keyStore = await jose.JWK.asKeyStore(ks.toString());
  res.send(keyStore.toJSON());
});

router.post("/login", login);
router.post("/verify", tokenVerify);

module.exports = router;
