const { usaStates } = require('../data/usa_states.json')
const { months } = require('../data/months.json')
class Validators {
  static validate_age (birthDate, age) {
    const realAge = Utils.get_real_age(birthDate)
    if (realAge === age) {
      return true
    }
    return false
  }

  static validate_state (state) {
    if (usaStates.includes(state)) return true
    return false
  }
}

class Utils {
  static get_real_age (birthDate) {
    const today = new Date()
    const month = today.getMonth() - birthDate.getMonth()
    let age = today.getFullYear() - birthDate.getFullYear()
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) age--
    return age
  }

  static filter_premium_plan (planData, birthDate, state, age, plan) {
    const clearPlan = planData.plan.trim().split(',').map((data) => {
      return data.trim()
    })
    const matchedState = planData.state === '*' ? true : (planData.state === state)
    const matchedMonthOfBirth = planData.monthOfBirth === '*' ? true : (planData.monthOfBirth === months[birthDate.getMonth()])
    const matchedAgeRange = (planData.ageRange.end >= age && planData.ageRange.start <= age)
    if (clearPlan.includes(plan) && matchedState && matchedMonthOfBirth && matchedAgeRange) { return true }
    return false
  }

  static response_formatter (plan) {
    return {
      carrier: plan.carrier,
      premium: plan.premium
    }
  }
}
module.exports = { Validators, Utils }
