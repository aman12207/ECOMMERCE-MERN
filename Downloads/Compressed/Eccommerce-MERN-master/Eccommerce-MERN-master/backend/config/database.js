const mongoose = require('mongoose')

const connectDB = () =>{
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(()=>{
    console.log(`Mongodb connected with server`);
  })
}

module.exports = connectDB;