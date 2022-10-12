const express = require("express");
const router = express.Router();
const { register, login, tokenVerify, loguot } = require("../controllers/jwt");

// router.get("/", (req, res, next) => {
//   res.send("/login , /tokenVerify");
// });

router.post("/login", login);

router.post("/verify", tokenVerify);

module.exports = router;
