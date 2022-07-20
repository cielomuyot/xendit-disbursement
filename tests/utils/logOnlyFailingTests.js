const { logger } = require('../../src/utils/logger')

const logError = logger.error
let state

logger.error = (...params) => {
  if (state === 'failed') {
    logError(...params)
  }
}

const logOnlyFailingTests = afterEach => {
  afterEach(function () {
    state = this.currentTest.state
  })
}

module.exports = logOnlyFailingTests
