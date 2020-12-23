const config = require('./utils/config')
const cors = require('cors')
const express = require('express')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const productsRouter = require('./controllers/products')

const app = express()

logger.info('connecting to ', config.DB_URL)

mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(result => {
    logger.info('connected to DB')
  })
  .catch(error => {
    logger.info('error connecting to DB: ', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/admin/products', productsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app