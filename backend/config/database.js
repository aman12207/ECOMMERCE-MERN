const mongoose = require('mongoose')

const connectDB = () =>{
  console.log(process.env.MONGO_URL)
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(()=>{
    console.log(`Mongodb connected with server`);
  })
}

module.exports = connectDB;