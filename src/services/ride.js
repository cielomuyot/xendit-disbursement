const {
  getPagination,
  InvalidPageTypeError,
  InvalidLimitTypeError,
  InvalidPageRangeError,
  InvalidLimitRangeError,
} = require('../utils/pagination')

const {
  InvalidStartingCoordinatesError,
  InvalidEndingCoordinatesError,
  InvalidRiderNameError,
  InvalidDriverNameError,
  InvalidDriverVehicleError,
  validateRidePayload,
} = require('../utils/validation')

const listRides = require('../daos/ride/list')
const createRide = require('../daos/ride/create')
const getRide = require('../daos/ride/get')

const { NoRidesFoundError } = require('../daos/ride/errors')

const get = db => async (req, res) => {
  try {
    const { id } = req.params
    const rides = await getRide(db)(id)

    res.send(rides)
  } catch (err) {
    switch (err.constructor) {
      case NoRidesFoundError:
        res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        })
        break
      default:
        res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        })
    }
  }
}

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
        res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        })
    }
  }
}

const create = db => async (req, res) => {
  try {
    const {
      start_lat,
      start_long,
      end_lat,
      end_long,
      rider_name,
      driver_name,
      driver_vehicle,
    } = req.body

    validateRidePayload({
      start_lat,
      start_long,
      end_lat,
      end_long,
      rider_name,
      driver_name,
      driver_vehicle,
    })

    const ride = await createRide(db)({
      start_lat,
      start_long,
      end_lat,
      end_long,
      rider_name,
      driver_name,
      driver_vehicle,
    })

    res.send(ride)
  } catch (err) {
    switch (err.constructor) {
      case InvalidStartingCoordinatesError:
        res.send({
          error_code: 'VALIDATION_ERROR',
          message:
            'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        })
        break
      case InvalidEndingCoordinatesError:
        res.send({
          error_code: 'VALIDATION_ERROR',
          message:
            'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        })
        break
      case InvalidRiderNameError:
        res.send({
          error_code: 'VALIDATION_ERROR',
          message: 'Rider name must be a non empty string',
        })
        break
      case InvalidDriverNameError:
        res.send({
          error_code: 'VALIDATION_ERROR',
          message: 'Driver name must be a non empty string',
        })
        break
      case InvalidDriverVehicleError:
        res.send({
          error_code: 'VALIDATION_ERROR',
          message: 'Driver vehicle must be a non empty string',
        })
        break
      default:
        res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        })
    }
  }
}

module.exports = { get, list, create }
