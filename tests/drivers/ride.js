'use strict'

const { numberBetween } = require('../utils/randomGenerator')

/**
 * Create an object for a ride. Values will be randomized if not passed.
 *
 * @param {Object} ride - the payload for the POST /rides
 * @param {number=} ride.start_lat - the start latitude
 * @param {number=} ride.end_lat - the end latitude
 * @param {number=} ride.start_long - the start longitude
 * @param {number=} ride.end_long - the end longitude
 * @param {string=} ride.rider_name - the rider name
 * @param {string=} ride.driver_name - the driver name
 * @param {string=} ride.driver_vehicle - the vehicle model
 * @returns {Object} an object with randomized values for the payload of POST /rides
 */
const createRideBody = ({
  start_lat = numberBetween(-90, 90),
  end_lat = numberBetween(-90, 90),
  start_long = numberBetween(-90, 90),
  end_long = numberBetween(-90, 90),
  rider_name = `rider_${Date.now()}`,
  driver_name = `driver_${Date.now()}`,
  driver_vehicle = `vehicle_${Date.now()}`,
} = {}) => ({
  start_lat,
  end_lat,
  start_long,
  end_long,
  rider_name,
  driver_name,
  driver_vehicle,
})

/**
 * Convert the POST /rides payload to a response body
 *
 * @param {Object} ride - the payload for the POST /rides
 * @param {number} ride.start_lat - the start latitude
 * @param {number} ride.end_lat - the end latitude
 * @param {number} ride.start_long - the start longitude
 * @param {number} ride.end_long - the end longitude
 * @param {string} ride.rider_name - the rider name
 * @param {string} ride.driver_name - the driver name
 * @param {string} ride.driver_vehicle - the vehicle model
 * @returns {Object} the converted object which uses camel case instead of snake case
 */
const convertRideResponse = ({
  start_lat,
  end_lat,
  start_long,
  end_long,
  rider_name,
  driver_name,
  driver_vehicle,
}) => ({
  startLat: start_lat,
  endLat: end_lat,
  startLong: start_long,
  endLong: end_long,
  riderName: rider_name,
  driverName: driver_name,
  driverVehicle: driver_vehicle,
})

module.exports = { createRideBody, convertRideResponse }
