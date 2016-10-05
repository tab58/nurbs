'use strict';

/**
 *  Computes the ith Bernstein basis function at the parameter value.
 *
 *  @param {Array|Number} i - the Bernstein basis function to evaluate
 *  @param {Number} n - the degree of the Bernstein basis functions
 *  @param {Number} u - the parameter value, 0 <= u <= 1
 *
 *  @returns {Number} - the Bernstein basis function value at the parameter value
 *
 */
var getOneBernsteinFunc = function getOneBernsteinFunc (i, n, u) {
  var j = 0;
  var k = 0;
  var temp = new Float64Array(n + 1);
  temp[n - i] = 1.0;
  var v = 1.0 - u;
  for (k = 1; k <= n; ++k) {
    for (j = n; j >= k; --j) {
      temp[j] = v * temp[j] + u * temp[j - 1];
    }
  }
  return temp[n];
};

module.exports = getOneBernsteinFunc;
