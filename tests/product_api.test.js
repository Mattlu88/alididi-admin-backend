const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Product = require('../models/product')
const assert = require('assert')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Product.deleteMany({})
  for (const initProduct of helper.initProducts) {
    let product = new Product(initProduct)
    await product.save()
  }
})

describe('GET /admin/products', () => {
  test('products are returned as json', async () => {
    await api
      .get('/admin/products')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all products are returned', async () => {
    const res = await api.get('/admin/products')
    expect(res.body).toHaveLength(helper.initProducts.length)
  })

  test('a specific product is with in the returned products', async () => {
    const res = await api.get('/admin/products')
    const SKUs = res.body.map(product => product.SKU)

    expect(SKUs).toContain('T062023')
    expect(SKUs).toContain('T062024')
  })
})

describe('GET /admin/products/:id', () => {
  test('succeeds viewing a product with a valid id', async () => {
    const initProducts = await helper.productsInDb()
    const firstProduct = initProducts[0]

    const res = await api
      .get(`/admin/products/${firstProduct.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body).toEqual(JSON.parse(JSON.stringify(firstProduct)))
  })

  test('fails with status code 400 id is invalid', async () => {
    const invalidId = '1a3232aaaa'

    await api
      .get(`/admin/products/${invalidId}`)
      .expect(400)
  })
})

describe('POST /admin/products', () => {
  test('product can be added with valid data', async () => {
    let newProduct = {
      SKU: "T062026",
      title: "Colgate Sensitive Pro Relief Whitening Toothpaste",
      size: "110g",
      contains: "This product contains Arginine 8% w/w and Sodium Monofluorophosphate 1.1% w/w (equivalent to 1450 ppm F). 1 Toothpaste",
      costPrice: 2.5,
      sellingPrice: 5
    }

    const res = await api
      .post('/admin/products')
      .send(newProduct)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const allProducts = await helper.productsInDb()
    expect(allProducts).toHaveLength(helper.initProducts.length + 1)
    const SKUs = allProducts.map(p => p.SKU)
    expect(SKUs).toContain('T062026')
  })

  test('product without SKU is not added', async () => {
    const product = {
      title: "Cadbury Scorched Almonds",
      description: "CADBURY milk chocolate coated almonds",
      size: "310g",
      contains: "Milk, Soy And Almonds. Milk Chocolate (86%), Almonds (12%). Milk Chocolate contains Cocoa Solids 27%, Milk Solids 26%.",
      costPrice: 2,
      sellingPrice: 5
    }

    const res = await api
      .post('/admin/products')
      .send(product)
      .expect(400)

    expect(res.body.error).toMatch(/`SKU` is required/)
  })
})

describe('DELETE /admin/products/:id', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const productsAtStart = await helper.productsInDb()
    const productToDelete = productsAtStart[0]

    await api
      .delete(`/admin/products/${productToDelete.id}`)
      .expect(204)
    
    const productsAtEnd = await helper.productsInDb()
    expect(productsAtEnd).toHaveLength(helper.initProducts.length - 1)

    const SKUs = productsAtEnd.map(p => p.SKU)
    expect(SKUs).not.toContain(productToDelete.SKU)
  })
})

describe('PUT /admin/products/:id', () => {
  test('succeeds change product data with a valid id', async () => {
    const productsAtStart = await helper.productsInDb()
    const productToModify = productsAtStart[0]

    const product = {
      ...productToModify,
      title: 'Cadbury Almonds',
      description: 'chocolate coated almonds',
      size: '200g',
      contains: 'Milk, Soy And Almonds.',
      costPrice: 3,
      sellingPrice: 6
    }

    await api
      .put(`/admin/products/${productToModify.id}`)
      .send(product)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const productsAtEnd = await helper.productsInDb()
    expect(productsAtEnd).toHaveLength(helper.initProducts.length)

    const productChanged = productsAtEnd[0]
    expect(productChanged.SKU).toBe(productToModify.SKU)
    expect(productChanged.title).toBe('Cadbury Almonds')
    expect(productChanged.description).toBe('chocolate coated almonds')
    expect(productChanged.size).toBe('200g')
    expect(productChanged.contains).toBe('Milk, Soy And Almonds.')
    expect(productChanged.costPrice).toBe(3)
    expect(productChanged.sellingPrice).toBe(6)
  })
})

afterAll(() => {
  mongoose.connection.close()
})