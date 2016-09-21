'use strict';

var glm = require('gl-matrix');
var array2d = require('../lib/create2dArray.js');
var findKnotSpan = require('./alg2-1.js');
var getDerivsOfBasisFunctions = require('./alg2-3.js');
var getAutoVectorType = require('../lib/getAutoVectorType.js');

var getCurveDerivativesGeneric = function getCurveDerivativesGeneric (u, p, U, P, d, C, vec) {
  var du = Math.min(d, p);
  var k = 0;
  var j = 0;
  var CK = C;
  var span = findKnotSpan(p, u, U);
  var D = array2d(du + 1, p + 1);
  getDerivsOfBasisFunctions(u, p, U, du, D);
  for (k = 0; k <= du; ++k) {
    vec.set(CK[k], 0, 0, 0, 0);
    for (j = 0; j <= p; ++j) {
      vec.scaleAndAdd(CK[k], CK[k], P[span - p + j], D[k][j]);
    }
  }
  return CK;
};

/**
 *  Computes the points at the parameter value on a series of derivative curves.
 *
 *  NOTES:
 *    1. Computes the full triangular table for nonzero basis functions.
 *
 *  @param {Number} u - the parameter value at which to evaluate the basis function
 *  @param {Number} p - the degree of the B-spline (integer)
 *  @param {Array|Number} U - the knot vector of the B-spline
 *  @param {Array|vec(2,3,4)} P - the control point array
 *  @param {Number} d - the number of derivatives to evaluate (integer, d in [0, Inf) but d > p is zero)
 *  @param {Array|vec(2,3,4)} C - an Array(d+1) array with vector element to hold the points of the derivative curves.
 *
 *  @returns {Array|Number} - the input parameter C
 */
var getCurveDerivatives = function getCurveDerivatives (u, p, U, P, d, C) {
  var vec = getAutoVectorType(P[0]);
  return getCurveDerivativesGeneric(u, p, U, P, d, C, vec);
};

module.exports = {
  getCurveDerivatives: getCurveDerivatives,
  getCurveDerivatives2: function (u, p, U, P, d, C) {
    return getCurveDerivativesGeneric(u, p, U, P, d, C, glm.vec2);
  },
  getCurveDerivatives3: function (u, p, U, P, d, C) {
    return getCurveDerivativesGeneric(u, p, U, P, d, C, glm.vec3);
  },
  getCurveDerivatives4: function (u, p, U, P, d, C) {
    return getCurveDerivativesGeneric(u, p, U, P, d, C, glm.vec4);
  },
  getCurveDerivativesGeneric: getCurveDerivativesGeneric
};
