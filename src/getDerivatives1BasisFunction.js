'use strict';

var ndarray = require('ndarray');

/*
 *  Computes the derivatives for a single basis function.
 *
 *  @param {Number} i -- the ith basis function (integer, zero-based)
 *  @param {Number} u -- the parameter value at which to evaluate the basis function
 *  @param {Number} p -- the degree of the B-spline (integer)
 *  @param {Array|Number} U -- the knot vector of the B-spline
 *  @param {Number} n -- the number of derivatives to evaluate (integer, n <= p)
 *  @param {Array|Number} D -- holds the derivatives of the ith basis function.
 *
 *  @returns {Array|Number} -- the input parameter D, or a Float64Array(n + 1) with the derivative info
 *
 *  NOTES:
 *    1. Computes the full triangular table for nonzero basis functions.
 */
module.exports = function getDerivatives1BasisFunction (i, u, p, U, n, D) {
  var ders = D || new Float64Array(n + 1);
  var j = 0;
  var jj = 0;
  var k = 0;
  var Uleft = 0.0;
  var Uright = 0.0;
  var saved = 0.0;
  var temp = 0.0;
  var N = ndarray(new Float64Array((p + 1) * (p + 1)), [p + 1, p + 1]);
  var ND = new Float64Array(n + 1);

  if (u < U[i] || u >= U[i + p + 1]) {
    for (k = 0; k <= n; ++k) {
      ders[k] = 0.0;
    }
    return;
  }
  for (j = 0; j <= p; ++j) {
    if (u >= U[i + j] && u < U[i + j + 1]) {
      N.set(j, 0, 1.0);
    } else {
      N.set(j, 0, 0.0);
    }
  }
  for (k = 1; k <= p; ++k) {
    if (N.get(0, k - 1) === 0.0) {
      saved = 0.0;
    } else {
      saved = ((u - U[i]) * N.get(0, k - 1)) / (U[i + k] - U[i]);
    }
    for (j = 0; j < p - k + 1; ++j) {
      Uleft = U[i + j + 1];
      Uright = U[i + j + k + 1];
      if (N.get(j + 1, k - 1) === 0.0) {
        N.set(j, k, saved);
        saved = 0.0;
      } else {
        temp = N.get(j + 1, k - 1) / (Uright - Uleft);
        N.set(j, k, saved + (Uright - u) * temp);
        saved = (u - Uleft) * temp;
      }
    }
  }
  ders[0] = N.get(0, p);
  for (k = 1; k <= n; ++k) {
    for (j = 0; j <= k; ++j) {
      ND[j] = N.get(j, p - k);
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
