const express = require('express');
const connectDB = require('./config/database.js')
const errorMiddleware = require('./middleware/error.js')
// importing routes
const product = require('./routes/productRoute');

const app = express();
const dotenv = require('dotenv');
// created environment
app.use(express.json()); // if we don't do that we will not be able to use req.body to access data
dotenv.config({path:"backend/config/config.env"})

// connecting db
connectDB();
// using routes
app.use('/api/v1',product)

// error middleware 
app.use(errorMiddleware)

module.exports = app;