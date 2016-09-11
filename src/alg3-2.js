'use strict';

var glm = require('gl-matrix');
var findKnotSpan = require('./alg2-1.js');
var getDerivsOfBasisFunctions = require('./alg2-3.js');
var getAutoVectorType = require('../lib/getAutoVectorType.js');

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
var getCurveDerivatives_generic = function getCurveDerivatives_generic (u, p, U, P, d, C, vec) {
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
      CK.push(vec.create());
    }
  }
  var span = findKnotSpan(p, u, U);
  var D = getDerivsOfBasisFunctions(u, p, U, du);
  for (k = 0; k <= du; ++k) {
    for (j = 0; j <= p; ++j) {
      vec.scaleAndAdd(CK[k], CK[k], P[span - p + j], D[k * (p + 1) + j]);
    }
  }
  return CK;
};

module.exports = {
  getCurveDerivatives: function (u, p, U, P, d, C) {
    var vec = getAutoVectorType(P[0]);
    return getCurveDerivatives_generic(u, p, U, P, d, C, vec);
  },
  getCurveDerivatives2: function (u, p, U, P, d, C) {
    return getCurveDerivatives_generic(u, p, U, P, d, C, glm.vec2);
  },
  getCurveDerivatives3: function (u, p, U, P, d, C) {
    return getCurveDerivatives_generic(u, p, U, P, d, C, glm.vec3);
  },
  getCurveDerivatives4: function (u, p, U, P, d, C) {
    return getCurveDerivatives_generic(u, p, U, P, d, C, glm.vec4);
  }
};
