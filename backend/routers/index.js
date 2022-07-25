const express = require('express')
const calculatorController = require('../controllers/calculator')
const router = express.Router()
router.use('/api', calculatorController)

module.exports = router
