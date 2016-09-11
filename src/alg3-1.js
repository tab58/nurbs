'use strict';

var glm = require('gl-matrix');
var findKnotSpan = require('./alg2-1.js');
var getBasisFunctions = require('./alg2-2.js');
var getAutoVectorType = require('../lib/getAutoVectorType.js');

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
var getCurvePoint_generic = function getCurvePoint_generic (u, p, U, P, vec) {
  var span = findKnotSpan(p, u, U);
  var N = new Float64Array(p + 1);
  getBasisFunctions(u, p, U, N);
  var C = vec.create();
  var i = 0;
  for (i = 0; i <= p; ++i) {
    vec.scaleAndAdd(C, C, P[span - p + i], N[i]);
  }
  return C;
};

module.exports = {
  getCurvePoint: function getCurvePoint (u, p, U, P) {
    var vec = getAutoVectorType(P[0]);
    return getCurvePoint_generic(u, p, U, P, vec);
  },
  getCurvePoint2: function getCurvePoint2 (u, p, U, P) {
    return getCurvePoint_generic(u, p, U, P, glm.vec2);
  },
  getCurvePoint3: function getCurvePoint3 (u, p, U, P) {
    return getCurvePoint_generic(u, p, U, P, glm.vec3);
  },
  getCurvePoint4: function getCurvePoint4 (u, p, U, P) {
    return getCurvePoint_generic(u, p, U, P, glm.vec4);
  }
};

