'use strict'

const { expect } = require('chai')
const request = require('supertest')
const createApp = require('../src/app')

const { range, orderBy } = require('lodash')

const { initializeDb } = require('../src/utils/db')

const { createRideBody, convertRideResponse } = require('./drivers/ride')

const logOnlyFailingTests = require('./utils/logOnlyFailingTests')

describe('/rides', () => {
  let app

  logOnlyFailingTests(afterEach)

  before(async () => {
    const db = await initializeDb()

    app = createApp(db)
  })

  describe('GET /', () => {
    it('should return correct response if there are no rides saved', async () => {
      const { type, statusCode, body } = await request(app).get('/rides')

      expect(type).to.be.equal('application/json')
      expect(statusCode).to.be.equal(404)

      expect(body).to.be.an('object')

      const { error_code, message } = body
      expect(error_code).to.be.a('string')
      expect(error_code).to.be.equal('RIDES_NOT_FOUND_ERROR')

      expect(message).to.be.a('string')
      expect(message).to.be.equal('Could not find any rides')
    })

    it('should return all rides', async () => {
      const rideBody = createRideBody()

      await request(app).post('/rides').send(rideBody)

      const { type, statusCode, body: rides } = await request(app).get('/rides')

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

    describe('pagination', () => {
      it('should return 5 rides by default', async () => {
        const {
          body: [initialData],
        } = await request(app).get('/rides')

        const rideBody = createRideBody()

        const newRides = await Promise.all(
          range(0, 5).map(async () => {
            const {
              body: [newRide],
            } = await request(app).post('/rides').send(rideBody)

            return newRide
          }),
        )

        const sortedRides = orderBy(
          [...newRides, initialData],
          ride => ride.rideID,
          'asc',
        )

        const expectedRides = sortedRides.slice(0, 5)

        const {
          type,
          statusCode,
          body: rides,
        } = await request(app).get('/rides')

        expect(type).to.be.equal('application/json')
        expect(statusCode).to.be.equal(200)

        expect(rides.length).to.be.equal(5)

        expect(rides).to.deep.equal(expectedRides)
      })

      it('should return the correct rides from limit', async () => {
        const { body: allRides } = await request(app).get('/rides')

        const sortedRides = orderBy(allRides, ride => ride.rideID, 'asc')

        const expectedRides = sortedRides.slice(0, 3)

        const {
          type,
          statusCode,
          body: rides,
        } = await request(app).get('/rides?page=1&limit=3')

        expect(type).to.be.equal('application/json')
        expect(statusCode).to.be.equal(200)

        expect(rides.length).to.be.equal(3)

        expect(rides).to.deep.equal(expectedRides)
      })

      it('should return the correct rides from offset', async () => {
        const { body: allRides } = await request(app).get('/rides?limit=20')

        const sortedRides = orderBy(allRides, ride => ride.rideID, 'asc')

        const expectedRides = sortedRides.slice(3, 6)

        const {
          type,
          statusCode,
          body: rides,
        } = await request(app).get('/rides?page=2&limit=3')

        expect(type).to.be.equal('application/json')
        expect(statusCode).to.be.equal(200)

        expect(rides.length).to.be.equal(3)

        expect(rides).to.deep.equal(expectedRides)
      })

      describe('errors', () => {
        describe('page', () => {
          it('should return error if page is not a number', async () => {
            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).get('/rides?page=test')

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('INVALID_PAGINATION')

            expect(message).to.be.a('string')
            expect(message).to.be.equal('page should be a number')
          })

          it('should return error if page is less than 1', async () => {
            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).get('/rides?page=-1')

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('INVALID_PAGINATION')

            expect(message).to.be.a('string')
            expect(message).to.be.equal('page should be greater than 0')
          })
        })

        describe('limit', () => {
          it('should return error if limit is not a number', async () => {
            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).get('/rides?limit=test')

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('INVALID_PAGINATION')

            expect(message).to.be.a('string')
            expect(message).to.be.equal('limit should be a number')
          })

          it('should return error if limit is less than 1', async () => {
            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).get('/rides?limit=-1')

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('INVALID_PAGINATION')

            expect(message).to.be.a('string')
            expect(message).to.be.equal('limit should be greater than 0')
          })
        })
      })
    })
  })

  describe('GET /:id', () => {
    it('should return correct response if there is no ride with the given id', async () => {
      const inexistentId = -1
      const { type, statusCode, body } = await request(app).get(
        `/rides/${inexistentId}`,
      )

      expect(type).to.be.equal('application/json')
      expect(statusCode).to.be.equal(404)

      expect(body).to.be.an('object')

      const { error_code, message } = body
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
        body: [{ rideID: secondRideID }],
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

  describe('POST /:id', () => {
    it('should successfully add a new ride', async () => {
      const rideBody = createRideBody()

      const {
        type,
        statusCode,
        body: newRide,
      } = await request(app).post('/rides').send(rideBody)

      expect(type).to.be.equal('application/json')
      expect(statusCode).to.be.equal(200)

      const expectedResponse = convertRideResponse(rideBody)

      expect(newRide).to.be.an('array')
      expect(newRide.length).to.be.equal(1)

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
      ] = newRide

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

    describe('errors', () => {
      describe('body validation', () => {
        describe('start_lat', () => {
          it('should return error if start_lat is less than -90', async () => {
            const rideBody = createRideBody({ start_lat: -91 })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            )
          })

          it('should return error if start_lat is more than 90', async () => {
            const rideBody = createRideBody({ start_lat: 91 })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            )
          })
        })

        describe('end_lat', () => {
          it('should return error if end_lat is less than -90', async () => {
            const rideBody = createRideBody({ end_lat: -91 })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            )
          })

          it('should return error if end_lat is more than 90', async () => {
            const rideBody = createRideBody({ end_lat: 91 })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            )
          })
        })

        describe('start_long', () => {
          it('should return error if start_long is less than -180', async () => {
            const rideBody = createRideBody({ start_long: -181 })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            )
          })

          it('should return error if start_long is more than 180', async () => {
            const rideBody = createRideBody({ start_long: 181 })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            )
          })
        })

        describe('end_long', () => {
          it('should return error if end_long is less than -180', async () => {
            const rideBody = createRideBody({ end_long: -181 })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            )
          })

          it('should return error if end_long is more than 180', async () => {
            const rideBody = createRideBody({ end_long: 181 })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            )
          })
        })

        describe('rider_name', () => {
          it('should return error if rider_name is not a string', async () => {
            const rideBody = createRideBody({ rider_name: 100 })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal('Rider name must be a non empty string')
          })

          it('should return error if rider_name is empty', async () => {
            const rideBody = createRideBody({ rider_name: '' })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal('Rider name must be a non empty string')
          })

          it('should return error if rider_name is undefined', async () => {
            const rideBody = createRideBody()

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app)
              .post('/rides')
              .send({ ...rideBody, rider_name: undefined })

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal('Rider name must be a non empty string')
          })
        })

        describe('driver_name', () => {
          it('should return error if driver_name is not a string', async () => {
            const rideBody = createRideBody({ driver_name: 100 })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'Driver name must be a non empty string',
            )
          })

          it('should return error if driver_name is empty', async () => {
            const rideBody = createRideBody({ driver_name: '' })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'Driver name must be a non empty string',
            )
          })

          it('should return error if driver_name is undefined', async () => {
            const rideBody = createRideBody()

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app)
              .post('/rides')
              .send({ ...rideBody, driver_name: undefined })

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'Driver name must be a non empty string',
            )
          })
        })

        describe('driver_vehicle', () => {
          it('should return error if driver_vehicle is not a string', async () => {
            const rideBody = createRideBody({ driver_vehicle: 100 })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'Driver vehicle must be a non empty string',
            )
          })

          it('should return error if driver_vehicle is empty', async () => {
            const rideBody = createRideBody({ driver_vehicle: '' })

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app).post('/rides').send(rideBody)

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'Driver vehicle must be a non empty string',
            )
          })

          it('should return error if driver_vehicle is undefined', async () => {
            const rideBody = createRideBody()

            const {
              type,
              statusCode,
              body: { error_code, message },
            } = await request(app)
              .post('/rides')
              .send({ ...rideBody, driver_vehicle: undefined })

            expect(type).to.be.equal('application/json')
            expect(statusCode).to.be.equal(400)

            expect(error_code).to.be.a('string')
            expect(error_code).to.be.equal('VALIDATION_ERROR')

            expect(message).to.be.a('string')
            expect(message).to.be.equal(
              'Driver vehicle must be a non empty string',
            )
          })
        })
      })
    })
  })
})
