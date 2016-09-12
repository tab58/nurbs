'use strict';

var glm = require('gl-matrix');
var getAutoVectorType = require('../lib/getAutoVectorType.js');

/*
 *  Computes the points for a given section (r1 to r2 inclusive) of a series of derivative curves.
 *
 *  @param {Number} u -- the parameter value at which to evaluate the basis function
 *  @param {Number} p -- the degree of the B-spline (integer)
 *  @param {Array|Number} U -- the knot vector of the B-spline
 *  @param {Array|vec2} P -- the 2D control points
 *  @param {Number} d -- the number of derivatives to evaluate (integer, d <= p)
 *  @param {Number} r1 -- the start of the control point region (integer)
 *  @param {Number} r2 -- the end of the control point region (integer, r2 > r1)
 *  @param {Array|vec2} Pk -- an Array to hold the arrays of points for the derivative curves.
 *
 *  @returns {Array|Number} -- the input parameter Pk, or a Array[d][r2 - r1] with
 *                             the derivative control points
 *  NOTES:
 *    1. Creates (d+1)*(r+1) vec2 elements.
 */
var getCurveDerivCtrlPointsGeneric = function getCurveDerivCtrlPointsGeneric (p, U, P, d, r1, r2, Pk, vec) {
  var r = r2 - r1;
  var PK;
  var i = 0;
  var k = 0;
  var temp;
  if (Pk) {
    PK = Pk;
  } else {
    PK = [];
    for (k = 0; k <= d; ++k) {
      temp = [];
      for (i = 0; i <= r - k; ++i) {
        temp.push(vec.create());
      }
      PK.push(temp);
    }
  }

  for (i = 0; i <= r; ++i) {
    vec.copy(PK[0][i], P[r1 + i]);
  }
  for (k = 1; k <= d; ++k) {
    temp = p - k + 1;
    for (i = 0; i <= r - k; ++i) {
      vec.sub(PK[k][i], PK[k - 1][i + 1], PK[k - 1][i]);
      vec.scale(PK[k][i], PK[k][i], temp / (U[r1 + i + p + 1] - U[r1 + i + k]));
    }
  }
  return PK;
};

module.exports = {
  getCurveDerivCtrlPoints: function getCurveDerivCtrlPoints (p, U, P, d, r1, r2, Pk) {
    var vec = getAutoVectorType(P[0]);
    return getCurveDerivCtrlPointsGeneric(p, U, P, d, r1, r2, Pk, vec);
  },
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

