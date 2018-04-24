const mongoose = require('mongoose')
const Product = require('../models/product')

exports.get_all = (req, res, next) => {
  Product.find()
  .select('-__v')
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      products: docs.map(doc => {
        return {
         ...doc._doc,
          // name: doc.name,
          // price: doc.price,
          // _id: doc._id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${doc._id}`
          }
        }
      })
    }
    res.status(200).json(response)
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
}

exports.save = (req, res, next) => {
  // console.log(req.file)
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })
  product.save().then(result => {
    res.status(201).json({
      message: 'Created product successfully',
      createdProduct: {
        name: result.name,
        price: result.price,
        _id: result._id,
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${result._id}`
        }
      }
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  })
}

exports.get_one = (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
  .select('-__v') // tudo menos __v
  .exec()
  .then(doc => {
    if (doc) {
      res.status(200).json({
        product: doc,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products'
        }
      })
    } else {
      res.status(404).json({message: 'No valid entry found for privided ID'})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({error: err})
  })
}

exports.update = (req, res, next) => {
  const id = req.params.productId
  const { product } = req.body
 
  Product.update({_id:id}, { $set: product})
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Product was updated',
      request: {
        type: 'GET',
        url: `http://localhost:3000/products/${id}`
      }
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  })
}

exports.delete = (req, res, next) => {
  const id = req.params.productId
    Product.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err =>{
      console.log(err)
      res.status(500).json({error:err})
    })
}