const CustomError = require("../../helpers/errors/CustomError");

const customErrorHadnler = (err, req, res, next) => {
  let customError = err;
  if (customError.name === "SyntaxError") {
    customError = new CustomError("Unexpected Syntax", 400);
  }
  if (customError.name === "ValidationError") {
    customError = new CustomError(err.message, 400);
  }

  res.status(customError.status || 500).json({
    success: false,
    data: { message: customError.message },
  });
};

module.exports = customErrorHadnler;
