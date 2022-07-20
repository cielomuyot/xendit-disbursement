const router = require('express').Router()

const bodyParser = require('body-parser')
const { list, create } = require('../services/ride')
const jsonParser = bodyParser.json()

const routes = db => {
  router.route('/').post(jsonParser, create(db))

  router.route('/').get(list(db))

  router.route('/:id').get((req, res) => {
    db.all(
      `SELECT * FROM Rides WHERE rideID='${req.params.id}'`,
      function (err, rows) {
        if (err) {
          return res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          })
        }

        if (rows.length === 0) {
          return res.send({
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides',
          })
        }

        res.send(rows)
      },
    )
  })

  return router
}

module.exports = routes
