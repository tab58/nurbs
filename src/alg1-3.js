'use strict';

var isInteger = Number.isInteger || require('../lib/isInteger.js');

/**
 *  Computes all the Bernstein basis functions at the parameter value.
 *
 *  @param {Number} n - the degree of the Bernstein basis functions
 *  @param {Number} u - the parameter value, 0 <= u <= 1
 *
 *  @returns {Number} - the Bernstein basis functions at the parameter value
 *
 */
var getAllBernsteinFuncs = function getAllBernsteinFuncs (n, u, B) {
  if (n < 0) {
    throw new Error('n must be greater than 0.');
  }
  if (!isInteger(n)) {
    throw new Error('n must be an integer.');
  }
  if (u > 1.0 || u < 0.0) {
    throw new Error('u must be between 0 and 1.');
  }
  if (B.length < n + 1) {
    throw new Error('B is not at least of length n + 1.');
  }

  B[0] = 1.0;
  var v = 1.0 - u;
  var j = 0;
  var k = 0;
  var saved = 0.0;
  var temp = 0;
  for (j = 1; j <= n; ++j) {
    saved = 0.0;
    for (k = 0; k < j; ++k) {
      temp = B[k];
      B[k] = saved + v * temp;
      saved = u * temp;
    }
    B[j] = saved;
  }
  return B;
};

module.exports = getAllBernsteinFuncs;
