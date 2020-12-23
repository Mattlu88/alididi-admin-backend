const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  SKU: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  size: {
    type: String,
    required: true
  },
  contains: {
    type: String,
  },
  costPrice: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: {}
})

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('product', productSchema)