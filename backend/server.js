const app = require('./app')

app.listen(process.env.PORT,()=>{
  console.log(`port is running port ${process.env.PORT}`)
})