'use strict';

var glm = require('gl-matrix');
var getAutoVectorType = require('../lib/getAutoVectorType.js');
var array1d = require('../lib/create1dArray.js');
var array2d = require('../lib/create2dArray.js');
var findKnotSpan = require('./alg2-1.js');
var getDerivsOfBasisFunctions = require('./alg2-3.js');

var getSurfPartialDerivsGeneric = function getSurfacePartialDerivsAtPointGeneric (p, U, q, V, P, u, v, d, SKL, vec) {
  var k = 0;
  var l = 0;
  var s = 0;
  var r = 0;
  var dd = 0;
  var vtmp;
  var du = Math.min(d, p);
  for (k = p + 1; k <= d; ++k) {
    for (l = 0; l <= d - k; ++l) {
      vtmp = SKL[k][l];
      vec.set(vtmp, 0.0, 0.0, 0.0, 0.0);
    }
  }
  var dv = Math.min(d, q);
  for (l = q + 1; l <= d; ++l) {
    for (k = 0; k <= d - l; ++k) {
      vtmp = SKL[k][l];
      vec.set(vtmp, 0.0, 0.0, 0.0, 0.0);
    }
  }
  var uspan = findKnotSpan(p, u, U);
  var Nu = array2d(du + 1, p + 1);
  var Nv = array2d(dv + 1, q + 1);
  getDerivsOfBasisFunctions(u, p, U, du, Nu);
  var vspan = findKnotSpan(q, v, V);
  getDerivsOfBasisFunctions(v, q, V, dv, Nv);
  var temp = array1d(q + 1, vec.create);
  for (k = 0; k <= du; ++k) {
    for (s = 0; s <= q; ++s) {
      vtmp = temp[s];
      vec.set(vtmp, 0.0, 0.0, 0.0, 0.0);
      for (r = 0; r <= p; ++r) {
        vec.scaleAndAdd(vtmp, vtmp, P[uspan - p + r][vspan - q + s], Nu[k][r]);
      }
    }
    dd = Math.min(d - k, dv);
    for (l = 0; l <= dd; ++l) {
      vtmp = SKL[k][l];
      vec.set(vtmp, 0.0, 0.0, 0.0, 0.0);
      for (s = 0; s <= q; ++s) {
        vec.scaleAndAdd(vtmp, vtmp, temp[s], Nv[l][s]);
      }
    }
  }
  return SKL;
};

/**
 *  Computes the partial derivatives of the surface.
 *
 *  NOTES:
 *    1. The element P[i][j] is the derivative of the surface with respect to u _i_ times
 *       and with respect to v _j_ times.
 *    2. With the above definition of P[i][j], 0 <= i + j <= d.
 *
 *  @param {Number|int} p - the degree of the surface in the u-direction
 *  @param {Array|Number} U - the knot vector in the u-direction
 *  @param {Number|int} q - the degree of the surface in the v-direction
 *  @param {Array|Number} V - the knot vector in the v-direction
 *  @param {Array|vec(2,3,4)} P - the control points of the surface
 *  @param {Number} u - the u parameter at which the derivatives are to be evaluated
 *  @param {Number} v - the v parameter at which the derivatives are to be evaluated
 *  @param {Number|int} d - the maximum order of the derivatives
 *  @param {Array|vec(2,3,4)} SKL - the output array to hold the partial derivatives
 *
 *  @returns {Array|vec(2,3,4)} - the input parameter SKL
 */
var getSurfacePartialDerivsAtPoint = function getSurfacePartialDerivsAtPoint (p, U, q, V, P, u, v, d, SKL) {
  var vec = getAutoVectorType(P[0][0]);
  return getSurfPartialDerivsGeneric(p, U, q, V, P, u, v, d, SKL, vec);
};

module.exports = {
  getSurfacePartialDerivsAtPoint: getSurfacePartialDerivsAtPoint,
  getSurfacePartialDerivsAtPoint2: function getSurfacePartialDerivsAtPoint2 (p, U, q, V, P, u, v, d, SKL) {
    return getSurfPartialDerivsGeneric(p, U, q, V, P, u, v, d, SKL, glm.vec2);
  },
  getSurfacePartialDerivsAtPoint3: function getSurfacePartialDerivsAtPoint3 (p, U, q, V, P, u, v, d, SKL) {
    return getSurfPartialDerivsGeneric(p, U, q, V, P, u, v, d, SKL, glm.vec3);
  },
  getSurfacePartialDerivsAtPoint4: function getSurfacePartialDerivsAtPoint4 (p, U, q, V, P, u, v, d, SKL) {
    return getSurfPartialDerivsGeneric(p, U, q, V, P, u, v, d, SKL, glm.vec4);
  },
  getSurfacePartialDerivsAtPointGeneric: getSurfPartialDerivsGeneric
};
