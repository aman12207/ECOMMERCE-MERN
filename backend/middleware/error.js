const ErrorHandler = require('../utils/errorHandler')

module.exports = (err,req,res,next)=>{
  err.statusCode = err.statusCode || 500;
  err.msg = err.msg || "Internal Server Error!!!";
  
  return res.status(err.statusCode).json({
    success : false, 
    err
  })
}