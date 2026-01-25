const ErrorResponse = require("../utils/errorResponse");

// 4 parameters ==> Error Handler
const errorHandler = async (err, req, res, next) => {
  //Creates copy so original err isn’t mutated.
  let error = {...err};
  error.message= err.message;

  console.error(err); // Logs full stack trace.

  // Mongoose bad ObjectId
  if(err.name==="CastError"){
    error = new ErrorResponse("Resource not Found", 404);
  }

  // Mongoose duplicate key
  if(err.code === 11000){
    error = new ErrorResponse("Duplicate field value entered", 400);
  }

  // Mongoose validation error ===> Mongoose throws this when schema rules fail.
  if(err.name==="ValidationError"){
    const message = Object.values(err.errors)
      .map(val => val.message)
      .join(", ");

    error = new ErrorResponse(message, 400);
  }

  //JWT error
  if(err.name==="JsonWebTokenError"){
    error = new ErrorResponse("Invalid token", 401);
  }
  if (err.name === "TokenExpiredError") {
    error = new ErrorResponse("Token expired", 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
}

module.exports = errorHandler;