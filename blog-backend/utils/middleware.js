const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requestLogger = (request, response, next) => {
  logger.info("Request method: ", request.method);
  logger.info("Path: ", request.path);
  logger.info("Body: ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({
    error: "unknown endpoint",
  });
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  console.log("decodedToken", decodedToken);
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  request.user = await User.findById(decodedToken.id);
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error("error", error.message);
  if (error.name === "CastError") {
    return response.status(400).send({
      error: "malformatted id",
    });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({
      error: error.message,
    });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }
  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
  errorHandler,
};
