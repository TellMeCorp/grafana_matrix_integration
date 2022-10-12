const jwt = require("jsonwebtoken");

const sendJwtToClient = (name, response) => {
  const token = generateJwtFromUser(name);
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
const generateJwtFromUser = (name) => {
  const { JWT_EXPIRE, JWT_SECRET } = process.env;

  const token = jwt.sign(
    {
      name,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRE,
    }
  );
  return token;
};

module.exports = { sendJwtToClient, isTokenIncluded, getAccessTokenFromHeader };
