const express = require('express')
const router = express.Router()
const logger = require('../logger')
const { Validators, Utils } = require('../utils')
const premiumPlanData = require('../data/premium_plan.json')

router.get('/calculator', (request, response) => {
  try {
    const birthDate = new Date(request.query.birthDate)
    const state = request.query.state
    const age = parseInt(request.query.age)
    const plan = request.query.plan
    if (!Validators.validate_age(birthDate, age)) {
      return response.status(400).json({
        error: 'age does not match with real age until now'
      })
    }
    if (!Validators.validate_state(state)) {
      return response.status(400).json({
        error: 'requested state does not exist'
      })
    }
    const result = premiumPlanData.filter((planRow) => {
      return Utils.filter_premium_plan(planRow, birthDate, state, age, plan)
    }).map((result) => {
      return Utils.response_formatter(result)
    })
    return response.status(200).send(result)
  } catch (e) {
    logger.error(e)
    response.status(500).json({
      error: e.message
    })
  }
})

module.exports = router
