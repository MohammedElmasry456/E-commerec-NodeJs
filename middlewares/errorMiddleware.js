const ApiError = require("../utils/apiError");

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = JsonWebTokenError();
    if (err.name === "TokenExpiredError") err = TokenExpiredError();
    sendErrorForProd(err, res);
  }
};

const JsonWebTokenError = () =>
  new ApiError("Invalid Token , Please Login Again...", 401);
const TokenExpiredError = () =>
  new ApiError("Expired Token , Please Login Again...", 401);

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    error: err,
    message: err.message,
    statck: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalError;
