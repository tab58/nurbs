'use strict';

var glm = require('gl-matrix');
var getAutoVectorType = require('../lib/getAutoVectorType.js');
var findKnotSpan = require('./alg2-1.js');
var curveDerivCpts = require('./alg3-3.js').getCurveDerivCtrlPointsGeneric;

/*
 *  Returns a 2D array with all nonzero basis functions for degrees 0 -> p.
 *  Basis functions are in upper triangular region, column indicates degree.
 */
var allBasisFunctions = function allBasisFunctions (p, u, U) {
  var i = findKnotSpan(p, u, U);
  var left = new Float64Array(p + 1);
  var right = new Float64Array(p + 1);
  var saved = 0.0;
  var temp = 0.0;
  var j = 0;
  var r = 0;

  var ndu = [];
  var tmp;
  for (j = 0; j <= p; ++j) {
    tmp = [];
    for (r = 0; r <= p; ++r) {
      tmp.push(0.0);
    }
    ndu.push(tmp);
  }

  ndu[0][0] = 1.0;
  for (j = 1; j <= p; ++j) {
    left[j] = u - U[i + 1 - j];
    right[j] = U[i + j] - u;
    saved = 0.0;
    for (r = 0; r < j; ++r) {
      // Lower triangle
      ndu[j][r] = right[r + 1] + left[j - r];
      temp = ndu[r][j - 1] / ndu[j][r];
      // Upper triangle
      ndu[r][j] = saved + right[r + 1] * temp;
      saved = left[j - r] * temp;
    }
    ndu[j][j] = saved;
  }
  return ndu;
};

/*
 *  Computes the derivatives for the curve at a specific parameter value.
 *
 *  @param {Number} u -- the parameter value at which to evaluate the basis function
 *  @param {Number} p -- the degree of the B-spline (integer)
 *  @param {Array|Number} U -- the knot vector of the B-spline
 *  @param {Array|vector} P -- the 2D control points
 *  @param {Number} d -- the number of derivatives to evaluate (integer, d <= p)
 *  @param {Array|vector} Ck -- an array of length d vectors, the values of the derivatives at the parameter value
 */
var getCurveDerivsAtPointGeneric = function getCurveDerivsAtPointGeneric (p, U, P, u, d, Ck, vec) {
  var du = Math.min(d, p);
  var k = 0;
  var j = 0;
  if (CK) {
    CK = Ck;
  } else {
    var CK = [];
    for (k = 0; k <= d; ++k) {
      CK.push(vec.create());
    }
  }

  var span = findKnotSpan(p, u, U);
  var N = allBasisFunctions(p, u, U);
  var PK = curveDerivCpts(p, U, P, du, span - p, span, null, vec);
  for (k = 0; k <= du; ++k) {
    for (j = 0; j <= p - k; ++j) {
      vec.scaleAndAdd(CK[k], CK[k], PK[k][j], N[j][p - k]);
    }
  }
  return CK;
};

module.exports = {
  getCurveDerivsAtPoint: function getCurveDerivsAtPoint (p, U, P, u, d, Ck) {
    var vec = getAutoVectorType(P[0]);
    return getCurveDerivsAtPointGeneric(p, U, P, u, d, Ck, vec);
  },
  getCurveDerivsAtPoint2: function getCurveDerivsAtPoint2 (p, U, P, u, d, Ck) {
    return getCurveDerivsAtPointGeneric(p, U, P, u, d, Ck, glm.vec2);
  },
  getCurveDerivsAtPoint3: function getCurveDerivsAtPoint3 (p, U, P, u, d, Ck) {
    return getCurveDerivsAtPointGeneric(p, U, P, u, d, Ck, glm.vec3);
  },
  getCurveDerivsAtPoint4: function getCurveDerivsAtPoint4 (p, U, P, u, d, Ck) {
    return getCurveDerivsAtPointGeneric(p, U, P, u, d, Ck, glm.vec4);
  },
  getCurveDerivsAtPointGeneric: getCurveDerivsAtPointGeneric
};
