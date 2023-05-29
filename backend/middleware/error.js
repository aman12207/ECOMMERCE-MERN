const ErrorHandler = require('../utils/errorHandler')

module.exports = (err,req,res,next)=>{

  if (err.name === "CastError") {       // for invalid id
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  
  return res.status(err.statusCode).json({
    success : false, 
    message : err.message
  })
}