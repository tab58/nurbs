'use strict';

var glm = require('gl-matrix');
var findKnotSpan = require('./alg2-1.js');
var getBasisFunctions = require('./alg2-2.js');
var alg3s1 = require('./alg3-1.js');
var getAutoVectorType = require('../lib/getAutoVectorType.js');

var getRationalCurvePointGeneric = function getRationalCurvePointGeneric (u, p, U, P, W, c, vec) {
  if (W === undefined || W.length === 0) {
    console.log('Empty weight array.');
    return alg3s1.getCurvePoint(u, p, U, P);
  }
  var span = findKnotSpan(p, u, U);
  var N = new Float64Array(p + 1);
  getBasisFunctions(u, p, U, N);
  var C = c; // (c ? vec.set(c, 0.0, 0.0, 0.0, 0.0) : vec.create());
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

/**
 *  Computes a point on a rational B-spline curve at the desired parameter value.
 *
 *  NOTES:
 *    1. Computes the knot span from the parameter value.
 *    2. When W is undefined or null, the weights default to 1.
 *
 *  @param {Number} u - the parameter value at which to evaluate the basis function
 *  @param {Number} p - the degree of the B-spline (integer)
 *  @param {Array|Number} U - the knot vector of the B-spline
 *  @param {Array|vec(2,3,4)} P - the 2D control points
 *  @param {Array|Number} W - the weights of the control points
 *  @param {vec(2,3,4)} C - the vector to hold the rational curve point
 *
 *  @returns {vec(2,3,4)} - the input parameter C
 *
 */
var getRationalCurvePoint = function getRationalCurvePoint (u, p, U, P, W, C) {
  var vec = getAutoVectorType(P[0]);
  return getRationalCurvePointGeneric(u, p, U, P, W, C, vec);
};

module.exports = {
  getRationalCurvePoint: getRationalCurvePoint,
  getRationalCurvePoint2: function getRationalCurvePoint2 (u, p, U, P, W, C) {
    return getRationalCurvePointGeneric(u, p, U, P, W, C, glm.vec2);
  },
  getRationalCurvePoint3: function getRationalCurvePoint3 (u, p, U, P, W, C) {
    return getRationalCurvePointGeneric(u, p, U, P, W, C, glm.vec3);
  },
  getRationalCurvePoint4: function getRationalCurvePoint4 (u, p, U, P, W, C) {
    return getRationalCurvePointGeneric(u, p, U, P, W, C, glm.vec4);
  },
  getRationalCurvePointGeneric: getRationalCurvePointGeneric
};
