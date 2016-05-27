'use strict';

var glm = require('gl-matrix');
var findKnotSpan = require('./findKnotSpan.js');
var getBasisFunctions = require('./getBasisFunctions.js');

 /*
 *  Computes the derivatives for all nonzero basis functions.
 *
 *  @param {Number} u -- the parameter value at which to evaluate the basis function
 *  @param {Number} p -- the degree of the B-spline (integer)
 *  @param {Array|vec2} P -- the 2D control points
 *  @param {Array|Number} U -- the knot vector of the B-spline
 *
 *  @returns {vec2} -- the point at the given parameter value
 *
 *  NOTES:
 *    1. Computes the knot span from the parameter value.
 */
module.exports = function getCurvePoint2D (u, p, U, P) {
  var span = findKnotSpan(p, u, U);
  var N = new Float64Array(p + 1);
  getBasisFunctions(u, p, U, N);
  var C = glm.vec2.create();
  var i = 0;
  for (i = 0; i <= p; ++i) {
    glm.vec2.scaleAndAdd(C, C, P[span - p + i], N[i]);
  }
  return C;
};
