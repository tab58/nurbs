'use strict';

var glm = require('gl-matrix');
var getAutoVectorType = require('../lib/getAutoVectorType.js');

var getCurveDerivCtrlPointsGeneric = function getCurveDerivCtrlPointsGeneric (p, U, P, d, r1, r2, Pk, vec) {
  var r = r2 - r1;
  var i = 0;
  var k = 0;
  var temp;
  var PK = Pk;

  for (i = 0; i <= r; ++i) {
    vec.copy(PK[0][i], P[r1 + i]);
  }
  for (k = 1; k <= d; ++k) {
    temp = p - k + 1;
    for (i = 0; i <= r - k; ++i) {
      // don't think we need to clear PK[k][i] since it's output of vec.sub()
      vec.sub(PK[k][i], PK[k - 1][i + 1], PK[k - 1][i]);
      vec.scale(PK[k][i], PK[k][i], temp / (U[r1 + i + p + 1] - U[r1 + i + k]));
    }
  }
  return PK;
};

/**
 *  Computes the points for a given section (r1 to r2 inclusive) of a series of derivative curves.
 *
 *  @param {Number} p - the degree of the B-spline (integer)
 *  @param {Array|Number} U - the knot vector of the B-spline
 *  @param {Array|vec(2,3,4)} P - the control point array
 *  @param {Number} d - the number of derivatives to evaluate (integer, d <= p)
 *  @param {Number} r1 - the start of the control point region (integer)
 *  @param {Number} r2 - the end of the control point region (integer, r2 > r1)
 *  @param {Array|vec(2,3,4)} Pk - an Array[d+1][r2-r1+1] to hold the arrays of points for the derivative curves.
 *
 *  @returns {Array|vec(2,3,4)} - the input parameter Pk
 */
var getCurveDerivCtrlPoints = function getCurveDerivCtrlPoints (p, U, P, d, r1, r2, Pk) {
  var vec = getAutoVectorType(P[0]);
  return getCurveDerivCtrlPointsGeneric(p, U, P, d, r1, r2, Pk, vec);
};

module.exports = {
  getCurveDerivCtrlPoints: getCurveDerivCtrlPoints,
  getCurveDerivCtrlPoints2: function getCurveDerivCtrlPoints2 (p, U, P, d, r1, r2, Pk) {
    return getCurveDerivCtrlPointsGeneric(p, U, P, d, r1, r2, Pk, glm.vec2);
  },
  getCurveDerivCtrlPoints3: function getCurveDerivCtrlPoints3 (p, U, P, d, r1, r2, Pk) {
    return getCurveDerivCtrlPointsGeneric(p, U, P, d, r1, r2, Pk, glm.vec3);
  },
  getCurveDerivCtrlPoints4: function getCurveDerivCtrlPoints4 (p, U, P, d, r1, r2, Pk) {
    return getCurveDerivCtrlPointsGeneric(p, U, P, d, r1, r2, Pk, glm.vec4);
  },
  getCurveDerivCtrlPointsGeneric: getCurveDerivCtrlPointsGeneric
};

