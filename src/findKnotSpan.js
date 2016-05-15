'use strict';

/*
 *  Computes the knot span, or the knot vector index that satisfies u_i <= u < u_{i+1}.
 *
 *  @param {Number} u -- the parameter value
 *  @param {Number} p -- the degree of the B-spline (integer)
 *  @param {Array|Number} U -- the knot vector of the B-spline
 *
 *  @returns {Number} -- the knot span for the parameter value (integer)
 *
 *  NOTES:
 *    1. Does no checks if the parameter value is greater than the maximum
 *       knot vector value or less than the minimum.
 */
module.exports = function findKnotSpan (p, u, U) {
  var n = U.length - p - 1;
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
