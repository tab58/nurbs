'use strict';

var findKnotSpan = require('./alg2-1.js');

/*
 *  Computes the derivatives for all nonzero basis functions.
 *
 *  @param {Number} u -- the parameter value at which to evaluate the basis function
 *  @param {Number} p -- the degree of the B-spline (integer)
 *  @param {Array|Number} U -- the knot vector of the B-spline
 *  @param {Array|Number} NN -- (optional) an Array(p + 1) that will hold the values
 *
 *  @returns {Array|Number} -- the input parameter NN or a new Float64Array(p + 1)
 *
 *  NOTES:
 *    1. Computes the knot span from the parameter value automatically.
 *    2. Uses 2 new Float64Array(p+1) for intermediate values.
 */
module.exports = function getBasisFunctions (u, p, U, NN) {
  var i = findKnotSpan(p, u, U);
  var N = NN || new Float64Array(p + 1);
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
