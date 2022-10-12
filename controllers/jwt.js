const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const CustomError = require("../helpers/errors/CustomError");

const {
  isTokenIncluded,
  getAccessTokenFromHeader,
  sendJwtToClient,
} = require("../helpers/auth/tokenHelpers");
const { generateJwtFromUser } = require("../middlewares/auth/jwt");

const login = asyncHandler(async (req, res, next) => {
  const { name, homeserver } = req.body;
  const r = await axios.get(
    `${homeserver}/_synapse/admin/v1/users/${name}/admin`
  );
  res.send(r);
  sendJwtToClient(name, res);
});

const tokenVerify = (req, res) => {
  const { JWT_SECRET } = process.env;
  const accessToken = req.body.token || req.query.token;
  if (!accessToken) {
    return res.status(400).json({
      success: false,
      message: "token yanlış",
    });
  }
  jwt.verify(accessToken, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "token yanlış",
      });
    }

    res.status(200).json({
      success: true,
      data: { name: decoded.name, token: accessToken },
    });
  });
};

const loguot = (req, res) => {
  if (!isTokenIncluded(req)) {
    return next(new CustomError("Giriş yapmadan burayı göremezsin", 401));
  }
  const accessToken = getAccessTokenFromHeader(req);
  jwt.destroy(accessToken);
  res.status(200).json({
    success: true,
  });
};

module.exports = {
  loguot,
  login,
  tokenVerify,
};
