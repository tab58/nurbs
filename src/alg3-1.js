'use strict';

var glm = require('gl-matrix');
var findKnotSpan = require('./alg2-1.js');
var getBasisFunctions = require('./alg2-2.js');
var getAutoVectorType = require('../lib/getAutoVectorType.js');

var getCurvePointGeneric = function getCurvePointGeneric (u, p, U, P, N, c, vec) {
  var span = findKnotSpan(p, u, U);
  getBasisFunctions(u, p, U, N);
  var C = (c ? vec.set(c, 0.0, 0.0, 0.0, 0.0) : vec.create());
  var i = 0;
  for (i = 0; i <= p; ++i) {
    vec.scaleAndAdd(C, C, P[span - p + i], N[i]);
  }
  return C;
};

/**
 *  Computes the point on the curve at the given parameter value.
 *
 *  NOTES:
 *    1. Computes the knot span from the parameter value.
 *    2. If the optional parameter is null/undefined, the vector is created and the dimension information is calculated from the first control point.
 *
 *  @param {Number} u - the parameter value at which to evaluate the basis function
 *  @param {Number} p - the degree of the B-spline (integer)
 *  @param {Array|Number} U - the knot vector of the B-spline
 *  @param {Array|vec(2,3,4)} P - the control points
 *  @param {Array|Number} N - the B-spline basis functions of the curve
 *  @param {Array|Number} [vec(2,3,4)] - a vector to hold the point data
 *
 *  @returns {vec(2,3,4)} - the optional parameter or a vector the point at the given parameter value
 */
var getCurvePoint = function getCurvePoint (u, p, U, P, N, C) {
  var vec = getAutoVectorType(P[0]);
  return getCurvePointGeneric(u, p, U, P, N, C, vec);
};

module.exports = {
  getCurvePoint: getCurvePoint,
  getCurvePoint2: function getCurvePoint2 (u, p, U, P, N, C) {
    return getCurvePointGeneric(u, p, U, P, N, glm.vec2);
  },
  getCurvePoint3: function getCurvePoint3 (u, p, U, P, N, C) {
    return getCurvePointGeneric(u, p, U, P, N, glm.vec3);
  },
  getCurvePoint4: function getCurvePoint4 (u, p, U, P, N, C) {
    return getCurvePointGeneric(u, p, U, P, N, glm.vec4);
  },
  getCurvePointGeneric: getCurvePointGeneric
};

