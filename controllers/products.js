const productsRouter = require('express').Router()
const Product = require('../models/product')
const logger = require('../utils/logger')

productsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (product) {
      res.status(200).json(product)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.get('/', async (req, res, next) => {
  try {
    const products = await Product.find({})
    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
})

productsRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body  
    const product = await Product.find({
      SKU: body.SKU
    })
    if (product.length > 0) {
      return res.status(400).json({
        error: `Product ${body.SKU} is already existed`
      })
    }

    const newProduct = new Product({
      SKU: body.SKU,
      title: body.title,
      description: body.description,
      size: body.size,
      contains: body.contains,
      costPrice: body.costPrice,
      sellingPrice: body.sellingPrice,
    })

    const savedProduct = await newProduct.save()
    res.status(200).json(savedProduct)
  } catch (error) {
    next(error)
  }
})

productsRouter.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const body = req.body

    const product = await Product.findById(id)
    if (product) {
      const modifiedProduct = {
        ...product.toJSON(),
        title: body.title,
        description: body.description,
        size: body.size,
        contains: body.contains,
        costPrice: body.costPrice,
        sellingPrice: body.sellingPrice
      }
    console.log(modifiedProduct)
      const updatedProduct = await Product.findByIdAndUpdate(id, modifiedProduct, { new: true })
      res.status(200).json(updatedProduct)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)
    if (deletedProduct) {
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.post('/bulk-delete', async (req, res, next) => {
  try {
    const ids = req.body  
    const products = await Product.find({ '_id': { $in: ids }})
    if (ids.length === products.length) {

    }
    res.status(200).send()
  } catch (error) {
    next(error)
  }
})

module.exports = productsRouter