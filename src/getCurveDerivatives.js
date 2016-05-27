'use strict';

var glm = require('gl-matrix');
var findKnotSpan = require('./findKnotSpan.js');
var getDerivativesBasisFunctions = require('./getDerivativesBasisFunctions.js');

/*
 *  Computes the points at the parameter value on a series of derivative curves.
 *
 *  @param {Number} u -- the parameter value at which to evaluate the basis function
 *  @param {Number} p -- the degree of the B-spline (integer)
 *  @param {Array|Number} U -- the knot vector of the B-spline
 *  @param {Array|vec2} P -- the 2D control points
 *  @param {Number} d -- the number of derivatives to evaluate (integer, d in [0, Inf) but d > p is zero)
 *  @param {Array|vec2} C -- a vector to hold the points at the derivative curves.
 *
 *  @returns {Array|Number} -- the input parameter C, or a Float64Array(d + 1) with the derivative point info
 *
 *  NOTES:
 *    1. Computes the full triangular table for nonzero basis functions.
 */
module.exports = function getCurveDerivatives (u, p, U, P, d, C) {
  var du = Math.min(d, p);
  var k = 0;
  var j = 0;
  var CK;
  if (C) {
    CK = C;
  } else {
    CK = [];
    k = du + 1;
    while (k--) {
      CK.push(glm.vec2.create());
    }
  }
  var span = findKnotSpan(p, u, U);
  var D = getDerivativesBasisFunctions(u, p, U, du);
  for (k = 0; k <= du; ++k) {
    for (j = 0; j <= p; ++j) {
      glm.vec2.scaleAndAdd(CK[k], CK[k], P[span - p + j], D[k * (p + 1) + j]);
    }
  }
  return CK;
};
