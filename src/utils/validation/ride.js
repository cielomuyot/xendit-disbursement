const {
  InvalidStartingCoordinatesError,
  InvalidEndingCoordinatesError,
  InvalidRiderNameError,
  InvalidDriverNameError,
  InvalidDriverVehicleError,
} = require('./errors')

const validateLatitude = latitude => latitude >= -90 && latitude <= 90

const validateLongitude = longitude => longitude >= -180 && longitude <= 180

const validateStartingCoordinates = (latitude, longitude) => {
  if (!validateLatitude(latitude) || !validateLongitude(longitude)) {
    throw new InvalidStartingCoordinatesError()
  }
}

const validateEndingCoordinates = (latitude, longitude) => {
  if (!validateLatitude(latitude) || !validateLongitude(longitude)) {
    throw new InvalidEndingCoordinatesError()
  }
}

const validateRiderName = riderName => {
  if (typeof riderName !== 'string' && riderName.length < 0) {
    throw new InvalidRiderNameError()
  }
}

const validateDriverName = driverName => {
  if (typeof driverName !== 'string' && driverName.length < 0) {
    throw new InvalidDriverNameError()
  }
}

const validateDriverVehicle = driverVehicle => {
  if (typeof driverVehicle !== 'string' && driverVehicle.length < 0) {
    throw new InvalidDriverVehicleError()
  }
}

const validate = ({
  start_lat,
  start_long,
  end_lat,
  end_long,
  rider_name,
  driver_name,
  driver_vehicle,
}) => {
  const startLatitude = Number(start_lat)
  const startLongitude = Number(start_long)
  const endLatitude = Number(end_lat)
  const endLongitude = Number(end_long)
  const riderName = rider_name
  const driverName = driver_name
  const driverVehicle = driver_vehicle

  validateStartingCoordinates(startLatitude, startLongitude)
  validateEndingCoordinates(endLatitude, endLongitude)

  validateRiderName(riderName)
  validateDriverName(driverName)
  validateDriverVehicle(driverVehicle)
}

module.exports = validate
