const get = require('./get')

const create =
  db =>
  async ({
    start_lat,
    start_long,
    end_lat,
    end_long,
    rider_name,
    driver_name,
    driver_vehicle,
  }) => {
    const values = [
      start_lat,
      start_long,
      end_lat,
      end_long,
      rider_name,
      driver_name,
      driver_vehicle,
    ]

    const { lastID } = await db.run(
      'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
      values,
    )

    return get(db)(lastID)
  }

module.exports = create
