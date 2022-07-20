const { NoRidesFoundError } = require('./errors')

const get = db => async rideId => {
  const rows = await db.all(`SELECT * FROM Rides WHERE rideID=${rideId}`)

  if (rows.length === 0) {
    throw new NoRidesFoundError()
  }

  return rows
}

module.exports = get
