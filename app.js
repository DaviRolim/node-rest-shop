const express = require('express')
const user = require('./api/routes/user')

const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')


const productRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')

mongoose.connect(`mongodb://node-shop:${process.env.MONGO_ATLAS_PW}@node-rest-shop-shard-00-00-730sn.mongodb.net:27017,node-rest-shop-shard-00-01-730sn.mongodb.net:27017,node-rest-shop-shard-00-02-730sn.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin`)

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json());

// Handling CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

// Routes
app.use('/products', productRoutes)
app.use('/orders', ordersRoutes)

app.use((req,res,next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error,req,res,next) => {
  res.status(error.status || 500)
  res.json({
    message: 'What are you trying to do?',
    err: error.message
  })
})

module.exports = app