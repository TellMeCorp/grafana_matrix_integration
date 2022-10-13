const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const CustomError = require("../helpers/errors/CustomError");
const jwktopem = require("jwk-to-pem");
const path = require("path");
const fs = require("fs");
const JWKeys = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/Keys.json"), "utf8")
);
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
    await sendJwtToClient(name, res);
  } else {
    return next(
      new CustomError("Admin girişi yapmadan burayı göremezsin", 401)
    );
  }
});

const tokenVerify = asyncHandler(async (req, res, next) => {
  let token = req.body.token || req.query.token;
  let decodedToken = jwt.decode(token, { complete: true });
  let kid = decodedToken["header"]["kid"];
  let keys = JWKeys["keys"][0];
  console.log(keys);

  const publicKey = jwktopem(keys);
  try {
    const decoded = jwt.verify(token, publicKey);
    res.status(200).json({
      success: true,
      data: { decoded },
    });
  } catch (e) {
    return next(new CustomError(e, 401));
  }
});

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
