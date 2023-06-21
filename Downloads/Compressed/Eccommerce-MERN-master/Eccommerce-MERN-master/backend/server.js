const app = require('./app');
const connectDB = require('./config/database.js')
const cloudinary = require("cloudinary");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {        //if we are accessing a variable which is not even declared like console.log(email)
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);  
  server.close(()=>{
    process.exit(1);
  })
});

// connecting db
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT,()=>{
  console.log(`port is running port ${process.env.PORT}`)
})

// unhandled promise rejections
process.on("unhandledRejection", (err)=>{       // if there is any error in while resolving a promise like if mongodb url is wrong server is not running nor crashed so we have to crash it manually
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(()=>{
    process.exit(1);
  })
})