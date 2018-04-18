const express = require('express')
const mongoose = require('mongoose')
const Product = require('../models/product')


const router = express.Router()



router.get('/', (req, res, next) => {
  Product.find()
  .select('name price _id')
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
})

router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
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

})

router.get('/:productId', (req, res, next) => {
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
})

router.patch('/:productId', (req, res, next) => {
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
})

router.delete('/:productId', (req, res, next) => {
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
})

module.exports = router