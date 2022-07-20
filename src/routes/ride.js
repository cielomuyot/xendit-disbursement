const router = require('express').Router()

const bodyParser = require('body-parser')
const asyncHandler = require('../middleware/asyncHandler')
const { get, list, create } = require('../services/ride')
const jsonParser = bodyParser.json()

const routes = db => {
  router.route('/').post(jsonParser, asyncHandler(create(db)))

  router.route('/').get(asyncHandler(list(db)))

  router.route('/:id').get(asyncHandler(get(db)))

  return router
}

module.exports = routes
