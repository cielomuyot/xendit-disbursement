const router = require('express').Router()

const bodyParser = require('body-parser')
const { get, list, create } = require('../services/ride')
const jsonParser = bodyParser.json()

const routes = db => {
  router.route('/').post(jsonParser, create(db))

  router.route('/').get(list(db))

  router.route('/:id').get(get(db))

  return router
}

module.exports = routes
