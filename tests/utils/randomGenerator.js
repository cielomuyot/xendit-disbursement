'use strict'

/**
 * Generate a random number from a range of numbers
 * @param {number} min - minimum number to be randomized
 * @param {number} max - maximum number to be randomized
 * @returns
 */
const numberBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

module.exports = {numberBetween}
