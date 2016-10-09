'use strict';

var findKnotSpan = require('./alg2-1.js');

/**
 *  Computes the derivatives for all nonzero basis functions.
 *
 *  NOTES:
 *    1. Uses 2 new Float64Array(p+1) for intermediate values.
 *
 *  @param {Number} u - the parameter value at which to evaluate the basis function
 *  @param {Number} p - the degree of the B-spline (integer)
 *  @param {Array|Number} U - the knot vector of the B-spline
 *  @param {Array|Number} N - an Array(p+1) that will hold the values
 *
 *  @returns {Array|Number} the argument N with the nonzero basis functions
 *
 */
var getBasisFunctions = function getBasisFunctions (u, p, U, N) {
  if (N.length <= p) {
    throw new Error('Array for basis function too small.');
  }

  var i = findKnotSpan(p, u, U);
  var left = new Float64Array(p + 1);
  var right = new Float64Array(p + 1);
  var j = p + 1;
  var r;
  var saved;
  var temp;
  while (j--) {
    left[j] = 0.0;
    right[j] = 0.0;
    N[j] = 0.0;
  }

  N[0] = 1.0;
  for (j = 1; j <= p; ++j) {
    left[j] = u - U[i + 1 - j];
    right[j] = U[i + j] - u;
    saved = 0.0;
    for (r = 0; r < j; ++r) {
      temp = N[r] / (right[r + 1] + left[j - r]);
      N[r] = saved + right[r + 1] * temp;
      saved = left[j - r] * temp;
    }
    N[j] = saved;
  }
  return N;
};

module.exports = getBasisFunctions;
