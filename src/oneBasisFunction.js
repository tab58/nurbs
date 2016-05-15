'use strict';

/*
 *  Computes the ith basis function.
 *
 *  @param {Number} i -- the basis function to compute (integer, zero-based)
 *  @param {Number} u -- the parameter value
 *  @param {Number} p -- the degree of the B-spline (integer)
 *  @param {Array|Number} U -- the knot vector of the B-spline
 *
 *  @returns {Number} -- the value of the ith basis function at the given parameter
 *
 *  NOTES:
 *    1. Does no checks if the parameter value is greater than the maximum
 *       knot vector value or less than the minimum.
 */
module.exports = function oneBasisFunction (i, u, p, U) {
  var m = U.length - 1;
  var N = new Float64Array(p + 1);
  var j = 0;
  var k = 0;
  var Uright = 0.0;
  var Uleft = 0.0;
  var saved = 0.0;
  var temp = 0.0;

  if ((i === 0 && u === U[0]) ||
      (i === m - p - 1 && u === U[m])) {
    return 1.0;
  }
  if (u < U[i] || u >= U[i + p + 1]) {
    return 0.0;
  }
  for (j = 0; j <= p; ++j) {
    if (u >= U[i + j] && u < U[i + j + 1]) {
      N[j] = 1.0;
    } else {
      N[j] = 0.0;
    }
  }
  for (k = 1; k <= p; ++k) {
    if (N[0] === 0.0) {
      saved = 0.0;
    } else {
      saved = ((u - U[i]) * N[0]) / (U[i + k] - U[i]);
    }
    for (j = 0; j < p - k + 1; ++j) {
      Uleft = U[i + j + 1];
      Uright = U[i + j + k + 1];
      if (N[j + 1] === 0.0) {
        N[j] = saved;
        saved = 0.0;
      } else {
        temp = N[j + 1] / (Uright - Uleft);
        N[j] = saved + (Uright - u) * temp;
        saved = (u - Uleft) * temp;
      }
    }
  }
  return N[0];
};
