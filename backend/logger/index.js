const developmentLogger = require('./developmentLogger')
const productionLogger = require('./productionLogger')
let logger = null

if (process.env.NODE_ENV !== 'production') {
  logger = developmentLogger()
} else {
  logger = productionLogger()
}
module.exports = logger
