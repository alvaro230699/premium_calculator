const supertest = require('supertest')
const { app, server } = require('../app')
const premiumPlanData = require('../data/premium_plan.json')
const originalArrayLength = premiumPlanData.length
const { Utils } = require('../utils')

const api = supertest(app)
describe('GET premium plans', () => {
  beforeEach(() => {
    premiumPlanData.splice(originalArrayLength)
  })
  test('returns premium plan correctly', async () => {
    const stringDate = '06/01/1940'
    const age = Utils.get_real_age(new Date(stringDate))
    const state = 'NY'
    const plan = 'A'
    premiumPlanData.push(
      {
        carrier: 'Carrier',
        plan: `${plan},D`,
        state,
        monthOfBirth: 'June',
        ageRange: {
          start: age - 5,
          end: age
        },
        premium: 0.5
      }
    )
    const response = await api.get(`/api/calculator/?birthDate=${stringDate}&state=${state}&age=${age}&plan=${plan}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body[0].carrier).toBe('Carrier')
    expect(response.body[0].premium).toBe(0.5)
  })
  test('returns more than 1 premium plan correctly', async () => {
    const stringDate = '06/01/1940'
    const age = Utils.get_real_age(new Date(stringDate))
    const state = 'NY'
    const plan = 'A'
    premiumPlanData.push(
      {
        carrier: 'Carrier',
        plan: `${plan},D`,
        state,
        monthOfBirth: 'June',
        ageRange: {
          start: age - 5,
          end: age
        },
        premium: 0.5
      }
      ,
      {
        carrier: 'Qwerty',
        plan,
        state: '*',
        monthOfBirth: '*',
        ageRange: {
          start: age - 5,
          end: age
        },
        premium: 0.5
      },
      {
        carrier: 'Qwerty',
        plan: 'A',
        state: 'NY',
        monthOfBirth: 'June',
        ageRange: {
          start: age + 1,
          end: age + 2
        },
        premium: 0.5
      }
    )
    const response = await api.get(`/api/calculator/?birthDate=${stringDate}&state=${state}&age=${age}&plan=${plan}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(2)
  })
})
afterAll(() => {
  server.close()
})
