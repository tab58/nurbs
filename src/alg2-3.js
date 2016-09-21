'use strict';

var findKnotSpan = require('./alg2-1.js');
var array2d = require('../lib/create2dArray.js');

/**
 *  Computes the derivatives for all nonzero basis functions.
 *
 *  NOTES:
 *    1. Automatically computes the knot span from the parameter value.
 *    2. Computes intermediate values in 2 Array[p+1], 1 Array[p+1][p+1],
 *       and 1 Array[2][p+1]
 *
 *  @param {Number} u - the parameter value at which to evaluate the basis function
 *  @param {Number} p - the degree of the B-spline (integer)
 *  @param {Array|Number} U - the knot vector of the B-spline
 *  @param {Number} n - the number of derivatives to evaluate (integer, n <= p)
 *  @param {Array|Number} D - an Array[n+1][p+1] that holds the derivatives of the basis functions.
 *
 *  @returns {Array|Number} -- the input argument D with the derivative info
 *
 */
var getDerivsOfBasisFunctions = function getDerivsOfBasisFunctions (u, p, U, n, D) {
  var i = findKnotSpan(p, u, U);
  var ders = D;
  // if (D) {
  //   ders = D;
  // } else {
  //   ders = array2d(n + 1, p + 1);
  // }
  var ndu = array2d(p + 1, p + 1);
  var a = array2d(2, p + 1);

  var left = new Float64Array(p + 1);
  var right = new Float64Array(p + 1);
  var saved = 0.0;
  var temp = 0.0;
  var j = 0;
  var k = 0;
  var r = 0;
  var d = 0.0;
  var s1 = 0;
  var s2 = 0;
  var j1 = 0;
  var j2 = 0;
  var rk = 0;
  var pk = 0;

  ndu[0][0] = 1.0;
  for (j = 1; j <= p; ++j) {
    left[j] = u - U[i + 1 - j];
    right[j] = U[i + j] - u;
    saved = 0.0;
    for (r = 0; r < j; ++r) {
      // Lower triangle
      ndu[j][r] = right[r + 1] + left[j - r];
      temp = ndu[r][j - 1] / ndu[j][r];
      // Upper triangle
      ndu[r][j] = saved + right[r + 1] * temp;
      saved = left[j - r] * temp;
    }
    ndu[j][j] = saved;
  }
  // Load the basis functions
  for (j = 0; j <= p; ++j) {
    ders[0][j] = ndu[j][p];
  }
  // Compute the derivatives
  for (r = 0; r <= p; ++r) {
    s1 = 0;
    s2 = 1;
    a[0][0] = 1.0;
    // Compute kth derivative
    for (k = 1; k <= n; ++k) {
      d = 0.0;
      rk = r - k;
      pk = p - k;
      if (r >= k) {
        a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
        d = a[s2][0] * ndu[rk][pk];
      }
      j1 = (rk >= -1) ? 1 : -rk;
      j2 = (r - 1 <= pk) ? k - 1 : p - r;
      for (j = j1; j <= j2; ++j) {
        temp = (a[s1][j] - a[s1][j - 1]) / ndu[pk + 1][rk + j];
        a[s2][j] = temp;
        d += a[s2][j] * ndu[rk + j][pk];
      }
      if (r <= pk) {
        a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r];
        d += a[s2][k] * ndu[r][pk];
      }

      ders[k][r] = d;
      j = s1;
      s1 = s2;
      s2 = j;
    }
  }

  r = p;
  for (k = 1; k <= n; ++k) {
    for (j = 0; j <= p; ++j) {
      ders[k][j] = ders[k][j] * r;
    }
    r *= (p - k);
  }
  return ders;
};

module.exports = getDerivsOfBasisFunctions;
