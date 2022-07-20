const {
  getPagination,
  InvalidPageTypeError,
  InvalidLimitTypeError,
  InvalidPageRangeError,
  InvalidLimitRangeError,
} = require('../utils/pagination')

const listRides = require('../daos/ride/list')
const { NoRidesFoundError } = require('../daos/ride/errors')

const list = db => async (req, res) => {
  try {
    const { limit, offset } = getPagination(req)
    const rides = await listRides(db)(limit, offset)
    res.send(rides)
  } catch (err) {
    switch (err.constructor) {
      case InvalidPageTypeError:
        res.send({
          error_code: 'INVALID_PAGINATION',
          message: 'page should be a number',
        })
        break
      case InvalidLimitTypeError:
        res.send({
          error_code: 'INVALID_PAGINATION',
          message: 'limit should be a number',
        })
        break
      case InvalidPageRangeError:
        res.send({
          error_code: 'INVALID_PAGINATION',
          message: 'page should be greater than 0',
        })
        break
      case InvalidLimitRangeError:
        res.send({
          error_code: 'INVALID_PAGINATION',
          message: 'limit should be greater than 0',
        })
        break
      case NoRidesFoundError:
        res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        })
        break
      default:
        res.send('Unknown error')
    }
  }
}

module.exports = { list }
