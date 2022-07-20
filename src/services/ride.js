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
const {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require('../utils/errors')

const get = db => async (req, res) => {
  try {
    const { id } = req.params
    const rides = await getRide(db)(id)

    res.send(rides)
  } catch (err) {
    switch (err.constructor) {
      case NoRidesFoundError:
        throw new NotFoundError(
          'Could not find any rides',
          'RIDES_NOT_FOUND_ERROR',
        )
      default:
        throw new InternalServerError('Unknown error', 'SERVER_ERROR')
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
        throw new BadRequestError(
          'page should be a number',
          'INVALID_PAGINATION',
        )

      case InvalidLimitTypeError:
        throw new BadRequestError(
          'limit should be a number',
          'INVALID_PAGINATION',
        )

      case InvalidPageRangeError:
        throw new BadRequestError(
          'page should be greater than 0',
          'INVALID_PAGINATION',
        )

      case InvalidLimitRangeError:
        throw new BadRequestError(
          'limit should be greater than 0',
          'INVALID_PAGINATION',
        )

      case NoRidesFoundError:
        throw new NotFoundError(
          'Could not find any rides',
          'RIDES_NOT_FOUND_ERROR',
        )

      default:
        res.send('Unknown error', 'SERVER_ERROR')
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
        throw new BadRequestError(
          'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
          'VALIDATION_ERROR',
        )

      case InvalidEndingCoordinatesError:
        throw new BadRequestError(
          'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
          'VALIDATION_ERROR',
        )

      case InvalidRiderNameError:
        throw new BadRequestError(
          'Rider name must be a non empty string',
          'VALIDATION_ERROR',
        )

      case InvalidDriverNameError:
        throw new BadRequestError(
          'Driver name must be a non empty string',
          'VALIDATION_ERROR',
        )

      case InvalidDriverVehicleError:
        throw new BadRequestError(
          'Driver vehicle must be a non empty string',
          'VALIDATION_ERROR',
        )

      default:
        throw new InternalServerError('Unknown error', 'SERVER_ERROR')
    }
  }
}

module.exports = { get, list, create }
