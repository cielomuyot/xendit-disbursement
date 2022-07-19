'use strict'

const {expect} = require('chai')
const request = require('supertest')

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

const app = require('../src/app')(db)
const buildSchemas = require('../src/schemas')

const {createRideBody, convertRideResponse} = require('./drivers/ride')

describe('/rides', () => {
  before(done => {
    db.serialize(err => {
      if (err) {
        return done(err)
      }

      buildSchemas(db)

      done()
    })
  })

  describe('GET /', () => {
    it('should return correct response if there are no rides saved', async () => {
      const {type, statusCode, body} = await request(app).get('/rides')

      expect(type).to.be.equal('application/json')
      expect(statusCode).to.be.equal(200)

      expect(body).to.be.an('object')

      const {error_code, message} = body
      expect(error_code).to.be.a('string')
      expect(error_code).to.be.equal('RIDES_NOT_FOUND_ERROR')

      expect(message).to.be.a('string')
      expect(message).to.be.equal('Could not find any rides')
    })

    it('should return all rides', async () => {
      const rideBody = createRideBody()

      await request(app).post('/rides').send(rideBody)

      const {type, statusCode, body: rides} = await request(app).get('/rides')

      expect(type).to.be.equal('application/json')
      expect(statusCode).to.be.equal(200)

      const expectedResponse = convertRideResponse(rideBody)

      expect(rides).to.be.an('array')
      expect(rides.length).to.be.equal(1)

      const [
        {
          rideID,
          startLat,
          endLat,
          startLong,
          endLong,
          riderName,
          driverName,
          driverVehicle,
        },
      ] = rides

      expect(rideID).to.be.a('number')
      expect(rideID).to.not.be.undefined

      expect(startLat).to.be.a('number')
      expect(startLat).to.be.equal(expectedResponse.startLat)

      expect(endLat).to.be.a('number')
      expect(endLat).to.be.equal(expectedResponse.endLat)

      expect(startLong).to.be.a('number')
      expect(startLong).to.be.equal(expectedResponse.startLong)

      expect(endLong).to.be.a('number')
      expect(endLong).to.be.equal(expectedResponse.endLong)

      expect(riderName).to.be.a('string')
      expect(riderName).to.be.equal(expectedResponse.riderName)

      expect(driverName).to.be.a('string')
      expect(driverName).to.be.equal(expectedResponse.driverName)

      expect(driverVehicle).to.be.a('string')
      expect(driverVehicle).to.be.equal(expectedResponse.driverVehicle)
    })
  })

  describe('GET /:id', () => {
    it('should return correct response if there is no ride with the given id', async () => {
      const inexistentId = -1
      const {type, statusCode, body} = await request(app).get(
        `/rides/${inexistentId}`
      )

      expect(type).to.be.equal('application/json')
      expect(statusCode).to.be.equal(200)

      expect(body).to.be.an('object')

      const {error_code, message} = body
      expect(error_code).to.be.a('string')
      expect(error_code).to.be.equal('RIDES_NOT_FOUND_ERROR')

      expect(message).to.be.a('string')
      expect(message).to.be.equal('Could not find any rides')
    })

    it('should correctly a ride with specific id', async () => {
      const firstRideBody = createRideBody()
      const secondRideBody = createRideBody()

      await request(app).post('/rides').send(firstRideBody)
      const {
        body: [{rideID: secondRideID}],
      } = await request(app).post('/rides').send(secondRideBody)

      const {
        type,
        statusCode,
        body: rides,
      } = await request(app).get(`/rides/${secondRideID}`)

      expect(type).to.be.equal('application/json')
      expect(statusCode).to.be.equal(200)

      const expectedResponse = convertRideResponse(secondRideBody)

      expect(rides).to.be.an('array')

      const [
        {
          rideID,
          startLat,
          endLat,
          startLong,
          endLong,
          riderName,
          driverName,
          driverVehicle,
        },
      ] = rides

      expect(rideID).to.not.be.undefined
      expect(rideID).to.be.a('number')
      expect(rideID).to.be.equal(secondRideID)

      expect(startLat).to.be.a('number')
      expect(startLat).to.be.equal(expectedResponse.startLat)

      expect(endLat).to.be.a('number')
      expect(endLat).to.be.equal(expectedResponse.endLat)

      expect(startLong).to.be.a('number')
      expect(startLong).to.be.equal(expectedResponse.startLong)

      expect(endLong).to.be.a('number')
      expect(endLong).to.be.equal(expectedResponse.endLong)

      expect(riderName).to.be.a('string')
      expect(riderName).to.be.equal(expectedResponse.riderName)

      expect(driverName).to.be.a('string')
      expect(driverName).to.be.equal(expectedResponse.driverName)

      expect(driverVehicle).to.be.a('string')
      expect(driverVehicle).to.be.equal(expectedResponse.driverVehicle)
    })
  })
})
