const {
  InvalidPageTypeError,
  InvalidLimitTypeError,
  InvalidPageRangeError,
  InvalidLimitRangeError,
} = require('./errors')

const getPagination = require('./get')

module.exports = {
  InvalidPageTypeError,
  InvalidLimitTypeError,
  InvalidPageRangeError,
  InvalidLimitRangeError,
  getPagination,
}
