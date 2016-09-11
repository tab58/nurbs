'use strict';

var glm = require('gl-matrix');
var findKnotSpan = require('./alg2-1.js');
var getBasisFunctions = require('./alg2-2.js');
var alg3_1 = require('./alg3-1.js');
var getAutoVectorType = require('../lib/getAutoVectorType.js');

 /*
 *  Computes the derivatives for all nonzero basis functions.
 *
 *  @param {Number} u -- the parameter value at which to evaluate the basis function
 *  @param {Number} p -- the degree of the B-spline (integer)
 *  @param {Array|Number} U -- the knot vector of the B-spline
 *  @param {Array|vec2} P -- the 2D control points
 *  @param {Array|Number} W -- the weights of the control points (optional)
 *
 *  @returns {vec2} -- the point at the given parameter value
 *
 *  NOTES:
 *    1. Computes the knot span from the parameter value.
 *    2. When W is undefined or null, the weights default to 1.
 */
var getRationalCurvePoint_generic = function getRationalCurvePoint_generic (u, p, U, P, W, vec) {
  if (W === undefined || W.length === 0) {
    console.log('Empty weight array.');
    return alg3_1.getCurvePoint(u, p, U, P);
  }
  var span = findKnotSpan(p, u, U);
  var N = new Float64Array(p + 1);
  getBasisFunctions(u, p, U, N);
  var C = vec.create();
  var i = 0;
  var w = 0.0;
  var wi = 0;
  for (i = 0; i <= p; ++i) {
    wi = N[i] * W[span - p + i];
    vec.scaleAndAdd(C, C, P[span - p + i], wi);
    w += wi;
  }
  if (w === 0) {
    throw new Error('Weighted basis functions add to zero.');
  }
  w = 1.0 / w;
  vec.scale(C, C, w);
  return C;
};

module.exports = {
  getRationalCurvePoint: function getRationalCurvePoint (u, p, U, P, W) {
    var vec = getAutoVectorType(P[0]);
    return getRationalCurvePoint_generic(u, p, U, P, W, vec);
  },
  getRationalCurvePoint2: function getRationalCurvePoint2 (u, p, U, P, W) {
    return getRationalCurvePoint_generic(u, p, U, P, W, glm.vec2);
  },
  getRationalCurvePoint3: function getRationalCurvePoint3 (u, p, U, P, W) {
    return getRationalCurvePoint_generic(u, p, U, P, W, glm.vec3);
  },
  getRationalCurvePoint4: function getRationalCurvePoint4 (u, p, U, P, W) {
    return getRationalCurvePoint_generic(u, p, U, P, W, glm.vec4);
  }
};
