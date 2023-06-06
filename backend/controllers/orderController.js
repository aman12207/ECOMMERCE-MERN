const Order = require("../models/orderModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user", // user stores the id of user who placed the order
    "name email" // it will find the user in User model and gives us name and email field of that user
  );
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }); // orders by currently logged in user
  res.status(200).json({
    success: true,
    orders,
  });
});

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  console.log(order);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (order) => {
      await updateStock(order.product, order.quantity);       // order.product = product id of product
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id,quantity){
  console.log(id,quantity);
  const product = await Product.findById(id);
  product.Stock -= quantity;
  
  await product.save({ validateBeforeSave: false });
}



exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
  });
});