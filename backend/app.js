'use-strict'
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const router = require('./routers/index')
const logger = require('./logger')
const { appConfig } = require('./config')

app.use(express.json({ limit: '1MB' }))
app.use(express.urlencoded({ limit: '200mb', extended: true }))
app.use(cors())
app.use(morgan('combined'))
app.use(router)
const PORT = appConfig.PORT

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

module.exports = { app, server }
