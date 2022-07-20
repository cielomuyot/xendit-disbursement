const { NoRidesFoundError } = require('./errors')

const list = db => async (limit, offset) => {
  const rows = await db.all(
    `SELECT * FROM Rides LIMIT ${limit} OFFSET ${offset}`,
  )

  if (rows.length === 0) {
    throw new NoRidesFoundError()
  }

  return rows
}

module.exports = list
