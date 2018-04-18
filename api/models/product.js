const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // serial Id
  name: {type: String, required: true},
  price: {type: Number, required: true}
})

module.exports = mongoose.model('Product', productSchema)
