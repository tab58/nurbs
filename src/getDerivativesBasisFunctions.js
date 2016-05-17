'use strict';

var ndarray = require('ndarray');
var findKnotSpan = require('./findKnotSpan.js');

/*
 *  Computes the derivatives for all nonzero basis functions.
 *
 *  @param {Number} u -- the parameter value at which to evaluate the basis function
 *  @param {Number} p -- the degree of the B-spline (integer)
 *  @param {Array|Number} U -- the knot vector of the B-spline
 *  @param {Number} n -- the number of derivatives to evaluate (integer, n <= p)
 *  @param {Array|Number} D -- holds the derivatives of the ith basis function.
 *
 *  @returns {Array|Number} -- the input parameter D, or a Float64Array(n + 1) with the derivative info
 *
 *  NOTES:
 *    1. Computes the knot span from the parameter value.
 *    2. Computes intermediate values in 2 Float64Array[p + 1], 1 Float64Array[p + 1][p + 1],
 *       and 1 Float64Array[2][p + 1]
 */
module.exports = function getDerivativesBasisFunctions (u, p, U, n, D) {
  var i = findKnotSpan(p, u, U);
  var ders = ndarray(D || new Float64Array((n + 1) * (p + 1)), [n + 1, p + 1]);
  var left = new Float64Array(p + 1);
  var right = new Float64Array(p + 1);
  var ndu = ndarray(new Float64Array((p + 1) * (p + 1)), [p + 1, p + 1]);
  var a = ndarray(new Float64Array(2 * (p + 1)), [2, p + 1]);
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

  ndu.set(0, 0, 1.0);
  for (j = 1; j <= p; ++j) {
    left[j] = u - U[i + 1 - j];
    right[j] = U[i + j] - u;
    saved = 0.0;
    for (r = 0; r < j; ++r) {
      // Lower triangle
      ndu.set(j, r, right[r + 1] + left[j - r]);
      temp = ndu.get(r, j - 1) / ndu.get(j, r);
      // Upper triangle
      ndu.set(r, j, saved + right[r + 1] * temp);
      saved = left[j - r] * temp;
    }
    ndu.set(j, j, saved);
  }
  // Load the basis functions
  for (j = 0; j <= p; ++j) {
    ders.set(0, j, ndu.get(j, p));
  }
  // Compute the derivatives
  for (r = 0; r <= p; ++r) {
    s1 = 0;
    s2 = 1;
    a.set(0, 0, 1.0);
    // Compute kth derivative
    for (k = 1; k <= n; ++k) {
      d = 0.0;
      rk = r - k;
      pk = p - k;
      if (r >= k) {
        a.set(s2, 0, a.get(s1, 0) / ndu.get(pk + 1, rk));
        d = a.get(s2, 0) * ndu.get(rk, pk);
      }
      j1 = (rk >= -1) ? 1 : -rk;
      j2 = (r - 1 <= pk) ? k - 1 : p - r;
      for (j = j1; j <= j2; ++j) {
        temp = (a.get(s1, j) - a.get(s1, j - 1)) / ndu.get(pk + 1, rk + j);
        if (s2 === 2 && j === 1) {
          console.log(temp);
        }
        a.set(s2, j, temp);
        d += a.get(s2, j) * ndu.get(rk + j, pk);
      }
      if (r <= pk) {
        a.set(s2, k, -a.get(s1, k - 1) / ndu.get(pk + 1, r));
        d += a.get(s2, k) * ndu.get(r, pk);
      }

      // if (r === 0) {
      //   console.log('a_' + k + ' = ');
      //   console.log(a.data);
      //   console.log('d = ' + d);
      // }
      ders.set(k, r, d);
      j = s1;
      s1 = s2;
      s2 = j;
    }
  }
  // console.log('a: ');
  // console.log(a.data);
  r = p;
  for (k = 1; k <= n; ++k) {
    for (j = 0; j <= p; ++j) {
      ders.set(k, j, ders.get(k, j) * r);
    }
    r *= (p - k);
  }
  return ders.data;
};
