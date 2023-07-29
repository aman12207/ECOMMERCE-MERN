const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

// create product  -- Admin Route
exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];
  if(typeof req.body.images == 'string'){      // ie there is only 1 image
    images.push(req.body.images);
  }
  else {
    images = req.body.images
  }
  const imagesLinks = [];
  for(let i = 0;i<images.length;i++){
    const result = await cloudinary.v2.uploader.upload(images[i], {   // upload file on cloudinary
      folder: "products",
    });
    imagesLinks.push({      // store its url in an array
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLinks;
  req.body.user = req.user.id; // req.user stores the current logged in user model it is stored in authorizeRole middleware as it runs before this funcn
  const product = await Product.create(req.body);
  console.log(product);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All Product Admin
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products
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
    return next(new ErrorHander("Product not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {     // uploading new images
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
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
  for(let i = 0;i<product.images.length;i++){
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully!!!",
  });
});

exports.createProudctReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find((review) => {
    return review.user.toString() === req.user._id.toString();
  });
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let sumOfRating = 0;
  product.reviews.forEach((review) => {
    sumOfRating += review.rating;
  });
  product.ratings = sumOfRating / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// it has 2 queries id = review id and productid = product id
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const reviews = product.reviews.filter((review) => {
    // create a new array which excludes the review we want to remove
    return review._id.toString() !== req.query.id.toString();
  });
  let sumOfRating = 0;
  reviews.forEach((review) => {
    sumOfRating += review.rating;
  });
  let ratings = 0;
  if(reviews.length>0){
    sumOfRating / reviews.length;
  }
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
});
