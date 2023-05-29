const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorHandler");

// create product  -- Admin Route
exports.createProduct = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const product = await Product.create(req.body);
  console.log("product is created");
  res.status(201).json({
    success: true,
    product,
  });
});

// get all product
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
  const products = await apiFeatures.query;     // filtered =
  res.status(200).json({
    success: true,
    products,
    productCount
  });
});

// get single product
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not found", 500));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// update product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    // product not found
    return next(new ErrorHandler("Product Not found", 500));
  }

  product = await Product.findOneAndUpdate(req.params.id, req.body, {
    new: true, // return updated product instead of prev one
    runValidators: true, // run the validation implemented in model
    useFindAndModify: false, // seFindAndModify option is set to false to use MongoDB's findOneAndUpdate function instead of the deprecated findAndModify function
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// delete product

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findOneAndDelete({ _id: req.params.id });
  if (!product) {
    return next(new ErrorHandler("Product Not found", 500));
  }
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully!!!",
  });
});
