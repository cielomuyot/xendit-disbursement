'use strict'

const request = require('supertest')
const createApp = require('../src/app')

const { initializeDb } = require('../src/utils/db')

describe('/health', () => {
  let app
  before(async () => {
    const db = await initializeDb()

    app = createApp(db)
  })

  describe('GET /health', () => {
    it('should return health', done => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done)
    })
  })
})
