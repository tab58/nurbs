'use strict';

var isInteger = Number.isInteger || require('../lib/isInteger.js');

/**
 *  Computes the ith Bernstein basis function at the parameter value.
 *
 *  @param {Array|Number} i - the Bernstein basis function to evaluate
 *  @param {Number} n - the degree of the Bernstein basis functions
 *  @param {Number} u - the parameter value, 0 <= u <= 1
 *
 *  @returns {Number} - the Bernstein basis function value at the parameter value
 *
 */
var getOneBernsteinFunc = function getOneBernsteinFunc (i, n, u) {
  if (i > n || i < 0) {
    throw new Error('i must be between 0 and n.');
  }
  if (!isInteger(i)) {
    throw new Error('i must be an integer.');
  }
  if (!isInteger(n)) {
    throw new Error('n must be an integer.');
  }
  if (u > 1.0 || u < 0.0) {
    throw new Error('u must be between 0 and 1.');
  }
  var j = 0;
  var k = 0;
  var temp = new Float64Array(n + 1);
  temp[n - i] = 1.0;
  var v = 1.0 - u;
  for (k = 1; k <= n; ++k) {
    for (j = n; j >= k; --j) {
      temp[j] = v * temp[j] + u * temp[j - 1];
    }
  }
  return temp[n];
};

module.exports = getOneBernsteinFunc;
