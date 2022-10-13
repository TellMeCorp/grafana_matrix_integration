const CustomError = require("../../helpers/errors/CustomError");
const jwt = require("jsonwebtoken");
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require("../../helpers/auth/tokenHelpers");

const getAccessToRoute = (req, res, next) => {
  const { JWT_SECRET } = process.env;

  if (!isTokenIncluded(req)) {
    return next(new CustomError("Giriş yapmadan burayı göremezsin token", 401));
  }

  const accessToken = getAccessTokenFromHeader(req);

  jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(
        new CustomError("Giriş yapmadan burayı göremezsin " + accessToken, 401)
      );
    }
    req.user = {
      name: decoded.name,
      token: accessToken,
    };
    next();
  });
};

module.exports = { getAccessToRoute };
