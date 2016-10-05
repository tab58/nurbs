'use strict';

/**
 *  Computes all the Bernstein basis functions at the parameter value.
 *
 *  @param {Number} n - the degree of the Bernstein basis functions
 *  @param {Number} u - the parameter value, 0 <= u <= 1
 *
 *  @returns {Number} - the Bernstein basis functions at the parameter value
 *
 */
var getAllBernsteinFuncs = function getAllBernsteinFuncs (n, u, B) {
  B[0] = 1.0;
  var v = 1.0 - u;
  var j = 0;
  var k = 0;
  var saved = 0.0;
  var temp = 0;
  for (j = 1; j <= n; ++j) {
    saved = 0.0;
    for (k = 0; k < j; ++k) {
      temp = B[k];
      B[k] = saved + v * temp;
      saved = u * temp;
    }
    B[j] = saved;
  }
  return B;
};

module.exports = getAllBernsteinFuncs;
