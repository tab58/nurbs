'use strict';

/**
 *  Computes the knot span, or the knot vector index that satisfies u<sub>i</sub> <= u < u<sub>i+1</sub>.
 *
 *  @param {Number} p - the degree of the B-spline (integer)
 *  @param {Number} u - the parameter value
 *  @param {Array|Number} U - the knot vector of the B-spline
 *
 *  @returns {Number} - the knot span for the parameter value (integer)
 *
 */
var findKnotSpan = function findKnotSpan (p, u, U) {
  var n = U.length - p - 1;
  if (u < U[p] || u > U[n + 1]) {
    throw new Error('u must be between U[p] and U[n + 1].');
  }
  if (u === U[n + 1]) {
    return n;
  }
  var lo = p;
  var hi = n + 1;
  var mid = Math.floor((lo + hi) / 2);
  while (u < U[mid] || u >= U[mid + 1]) {
    if (u < U[mid]) {
      hi = mid;
    } else {
      lo = mid;
    }
    mid = Math.floor((lo + hi) / 2);
  }
  return mid;
};

module.exports = findKnotSpan;
