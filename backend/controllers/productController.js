const Product = require('../models/productModel')

// create product  -- Admin Route
exports. createProduct = async(req,res,next)=>{
  try{
    console.log(req.body);
    const product = await Product.create(req.body);
    console.log('product is created');
    res.status(201).json({
      success : true, 
      product
    })
  }
  catch(err){
    console.log(err);
  }
}

// get all product
exports.getAllProducts = async(req,res,next) =>{
  try{
    const products = await Product.find({});
    console.log("working")
    res.status(200).json({
      success : true, 
      products
    })
  }
  catch(err){
    console.log(err);
  }
}

// get single product
exports.getSingleProduct = async(req,res,next) =>{
  try{
    let product = await Product.findById(req.params.id);
    if(!product){
      return res.status(500).json({
        success : false, 
        message : "Product Not found"
      })
    }
    res.status(200).json({
      success : true, 
      product
    })
  }
  catch(err){
    console.log(err);
  }
}


// update product
exports.updateProduct = async(req,res,next) =>{
  try{
    let product = await Product.findById(req.params.id);
    if(!product){         // product not found
      return res.status(500).json({
        success : false, 
        message : "Product Not found"
      })
    }
    
    product = await Product.findOneAndUpdate(req.params.id,req.body,{
      new : true,         // return updated product instead of prev one
      runValidators: true,      // run the validation implemented in model
      useFindAndModify: false,      // seFindAndModify option is set to false to use MongoDB's findOneAndUpdate function instead of the deprecated findAndModify function
    })
    res.status(200).json({
      success : true, 
      product
    })
  }
  catch(err){
    console.log(err);
  }
}


// delete product 

exports.deleteProduct = async(req,res,next)=>{
  try{
    let product = await Product.findOneAndDelete({_id : req.params.id});
    if(!product){
      return res.status(500).json({
        success : false, 
        message : "Product Not found"
      })
    }
    res.status(200).json({
      success : true, 
      message : "Product Deleted Successfully!!!"
    })
  }
  catch(err){
    console.log(err);
  }
}