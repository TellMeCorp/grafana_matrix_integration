const jwt = require("jsonwebtoken");
const fs = require("fs");
const ms = require("ms");
const jose = require("node-jose");

const sendJwtToClient = async (name, response) => {
  const token = await generateJwtFromUser(name);
  const { JWT_COOKIE, NODE_ENV } = process.env;
  return response.status(200).json({
    success: true,
    data: { token },
  });
};

const isTokenIncluded = (req) => {
  return (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer: ")
  );
};

const getAccessTokenFromHeader = (req) => {
  const authorization = req.headers.authorization;
  const access_token = authorization.split(" ")[1];
  return access_token;
};
const generateJwtFromUser = async (name) => {
  const path = require("path");
  const JWKeys = fs.readFileSync(path.join(__dirname, "../../src/Keys.json"));

  const keyStore = await jose.JWK.asKeyStore(JWKeys.toString());

  const [key] = keyStore.all({ use: "sig" });

  const opt = { compact: true, jwk: key, fields: { typ: "jwt" } };

  const payload = JSON.stringify({
    exp: Math.floor((Date.now() + ms("1d")) / 1000),
    iat: Math.floor(Date.now() / 1000),
    sub: name.split(":")[0].substring(1),
    name: name.split(":")[0].substring(1).replace(":", " "),
    email: name.replace(":", "@").substring(1),
  });

  const token = await jose.JWS.createSign(opt, key).update(payload).final();
  return token;
};

module.exports = { sendJwtToClient, isTokenIncluded, getAccessTokenFromHeader };
