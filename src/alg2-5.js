'use strict';

var array1d = require('../lib/create1dArray.js');
var array2d = require('../lib/create2dArray.js');

/**
 *  Computes the derivatives for a single basis function.
 *
 *  NOTES:
 *    1. Computes the full triangular table for nonzero basis functions.
 *    2. Computes intermediate values in 1 Float64Array[p+1][p+1] and 1 Float64Array[p+1]
 *
 *  @param {Number} i - the ith basis function (integer, zero-based)
 *  @param {Number} u - the parameter value at which to evaluate the basis function
 *  @param {Number} p - the degree of the B-spline (integer)
 *  @param {Array|Number} U - the knot vector of the B-spline
 *  @param {Number} n - the number of derivatives to evaluate (integer, n <= p)
 *  @param {Array|Number} D - an Array(n+1) that holds the derivatives of the ith basis function.
 *
 *  @returns {Array|Number} - the input parameter D
 */
var getDerivsOf1BasisFunction = function getDerivsOf1BasisFunction (i, u, p, U, n, D) {
  var m = U.length - 1;
  if (i > m) {
    throw new Error('i must be less than or equal to U.length - 1.');
  }
  if (i < 0) {
    throw new Error('i must be greater than 0.');
  }
  if (D.length <= n) {
    throw new Error('D must be of dimensions [n+1][p+1].');
  }
  var k = 0;
  for (k = 0; k < D.length; ++k) {
    if (D[k].length <= p) {
      throw new Error('D must be of dimensions [n+1][p+1].');
    }
  }
  var ders = D;
  var j = 0;
  var jj = 0;
  var Uleft = 0.0;
  var Uright = 0.0;
  var saved = 0.0;
  var temp = 0.0;
  var N = array2d(p + 1, p + 1);
  var ND = array1d(n + 1);

  if (u < U[i] || u >= U[i + p + 1]) {
    for (k = 0; k <= n; ++k) {
      ders[k] = 0.0;
    }
    return;
  }
  for (j = 0; j <= p; ++j) {
    if (u >= U[i + j] && u < U[i + j + 1]) {
      N[j][0] = 1.0;
    }
  }
  for (k = 1; k <= p; ++k) {
    if (N[0][k - 1] === 0.0) {
      saved = 0.0;
    } else {
      saved = ((u - U[i]) * N[0][k - 1]) / (U[i + k] - U[i]);
    }
    for (j = 0; j < p - k + 1; ++j) {
      Uleft = U[i + j + 1];
      Uright = U[i + j + k + 1];
      if (N[j + 1][k - 1] === 0.0) {
        N[j][k] = saved;
        saved = 0.0;
      } else {
        temp = N[j + 1][k - 1] / (Uright - Uleft);
        N[j][k] = saved + (Uright - u) * temp;
        saved = (u - Uleft) * temp;
      }
    }
  }
  ders[0] = N[0][p];
  for (k = 1; k <= n; ++k) {
    for (j = 0; j <= k; ++j) {
      ND[j] = N[j][p - k];
    }
    for (jj = 1; jj <= k; ++jj) {
      if (ND[0] === 0.0) {
        saved = 0.0;
      } else {
        saved = ND[0] / (U[i + p - k + jj] - U[i]);
      }
      for (j = 0; j < k - jj + 1; ++j) {
        Uleft = U[i + j + 1];
        Uright = U[i + j + p + jj + 1];
        if (ND[j + 1] === 0.0) {
          ND[j] = (p - k + jj) * saved;
          saved = 0.0;
        } else {
          temp = ND[j + 1] / (Uright - Uleft);
          ND[j] = (p - k + jj) * (saved - temp);
          saved = temp;
        }
      }
    }
    ders[k] = ND[0];
  }
  return ders;
};

module.exports = getDerivsOf1BasisFunction;
