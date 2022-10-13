const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const CustomError = require("../helpers/errors/CustomError");
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
  sendJwtToClient,
} = require("../helpers/auth/tokenHelpers");

const login = asyncHandler(async (req, res, next) => {
  const { name, homeserver, accessToken } = req.body;
  var r = await axios.get(
    `${homeserver}_synapse/admin/v1/users/${name}/admin`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (r.data["admin"] == true) {
    sendJwtToClient(name, res);
  } else {
    return next(
      new CustomError("Admin girişi yapmadan burayı göremezsin", 401)
    );
  }
});

const tokenVerify = (req, res, next) => {
  const { JWT_SECRET } = process.env;
  const accessToken = req.body.token || req.query.token;
  if (!accessToken) {
    return next(new CustomError("Hatalı Token", 401));
  }
  jwt.verify(accessToken, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(new CustomError("Hatalı Token", 401));
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
    message: "Çıkış yapıldı",
  });
};

module.exports = {
  loguot,
  login,
  tokenVerify,
};
