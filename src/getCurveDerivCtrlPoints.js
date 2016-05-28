'use strict';

var glm = require('gl-matrix');

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
module.exports = function getCurveDerivCtrlPoints (u, p, U, P, d, r1, r2, Pk) {
  // var n = P.length - 1;
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
      for (i = 0; i <= r; ++i) {
        temp.push(glm.vec2.create());
      }
      PK.push(temp);
    }
  }
  console.log('PK = ');
  console.log(PK);

  for (i = 0; i <= r; ++i) {
    glm.vec2.copy(PK[0][i], P[r1 + i]);
  }
  for (k = 1; k <= d; ++k) {
    temp = p - k + 1;
    for (i = 0; i <= r - k; ++i) {
      glm.vec2.sub(PK[k][i], PK[k - 1][i + 1], PK[k - 1][i]);
      glm.vec2.scale(PK[k][i], temp / (U[r1 + i + p + 1] - U[r1 + i + k]));
    }
  }
  return PK;
};
