const User = require("../models/userModel");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendCookie = require("../utils/sendCookie");
const sendEmail  = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "public_id",
      url: "sample_url",
    },
  });
  sendCookie(user, 201, res);
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendCookie(user, 200, res);
});

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout Successfully !!!",
  });
});

exports.forgetPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false }); // save the changes made in user

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    // if error occurs reset the properties that you have updated in prev steps
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto       // as we were hashing the token before storing it so do it again before comparing them
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendCookie(user, 200, res);
});

exports.getUserDetails = catchAsyncError(async(req,res,next)=>{
  // const user = await User.findById(req.user.id);       // user will be authenticated, i.e req.user stores the whole user
  // console.log(req.user,req.user.id,req.user._id,user);
  res.status(200).json({
    success: true,
    user : req.user             // as user is authenticated before calling this funcn so req.user stores the currently logged in user
  });
})

exports.updatePassword = catchAsyncError(async(req,res,next)=>{
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 401));
  }

  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHandler("Password does not match", 400));
  }
  console.log(req.body.newPassword)
  user.password = req.body.newPassword;       // req.pre function will hash it 
  await user.save();
  sendCookie(user,200,res);
})

exports.updateProfile = catchAsyncError(async(req,res,next)=>{
  const newUserData = {
    name : req.body.name,
    email : req.body.email
    // cloudinary
  }
  console.log(req.body,newUserData);
  const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new : true,
    runValidators: true,
    useFindAndModify : false
  })
  res.status(200).json({
    success: true,
    user
  });
})


// for admin
exports.getAllUser = catchAsyncError(async(req,res,next)=>{
  const users = await User.find();
  res.status(200).json({
    success: true,
    users
  })
})

// get details of a single user
exports.getSingleUser = catchAsyncError(async(req,res,next)=>{
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(
        "No users found",
        400
      )
    );
  }  
  res.status(200).json({
    success: true,
    user
  })
})

exports.updateUserRole = catchAsyncError(async(req,res,next)=>{
  const newUserData = {
    name : req.body.name,
    email : req.body.email,
    role : req.body.role
  }
  console.log(req.body,newUserData);
  const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new : true,
    runValidators: true,
    useFindAndModify : false
  })
  res.status(200).json({
    success: true,
    user
  });
})

exports.deleteUser = catchAsyncError(async(req,res,next)=>{
  const user = await User.findOneAndDelete({_id : req.params.id});
  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }
  // cloudinary
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });

})
