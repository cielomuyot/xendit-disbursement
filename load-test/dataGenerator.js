const { createRideBody } = require('../tests/drivers/ride')

module.exports = {
  beforeRequestHandler(req, ctx, ee, next) {
    return next()
  },
  generateData(req, ctx, ee, next) {
    req.json = { ...createRideBody() }

    return next()
  },
}
