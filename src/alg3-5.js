'use strict';

var glm = require('gl-matrix');
var getAutoVectorType = require('../lib/getAutoVectorType.js');
var findKnotSpan = require('./alg2-1.js');
var getBasisFunctions = require('./alg2-2.js');

var getSurfacePointGeneric = function getSurfacePointGeneric (p, U, q, V, P, u, v, S, vec) {
  var uspan = findKnotSpan(p, u, U);
  var vspan = findKnotSpan(q, v, V);
  var i = 0;
  var Nu = [];
  var Nv = [];
  for (i = 0; i <= p; ++i) {
    Nu.push(0.0);
  }
  for (i = 0; i <= q; ++i) {
    Nv.push(0.0);
  }
  getBasisFunctions(u, p, U, Nu);
  getBasisFunctions(v, q, V, Nv);
  var uind = uspan - p;

  var Sv = (S ? vec.set(S, 0.0, 0.0, 0.0, 0.0) : vec.create());
  var k = 0;
  var l = 0;
  var temp = vec.create();
  var vind = 0;
  for (l = 0; l <= q; ++l) {
    vec.set(temp, 0.0, 0.0, 0.0, 0.0);
    vind = vspan - q + l;
    for (k = 0; k <= p; ++k) {
      vec.scaleAndAdd(temp, temp, P[uind + k][vind], Nu[k]);
    }
    vec.scaleAndAdd(Sv, Sv, temp, Nv[l]);
  }
  return Sv;
};

/**
 *  Computes a point on a surface.
 *
 *  @param {Number|int} p - the degree of the surface in the u-direction
 *  @param {Array|Number} U - the knot vector in the u-direction
 *  @param {Number|int} q - the degree of the surface in the v-direction
 *  @param {Array|Number} V - the knot vector in the v-direction
 *  @param {Array|vec(2,3,4)} P - the control point net, with P[u][v]
 *  @param {Number} u - the u-parameter value
 *  @param {Number} v - the v-parameter value
 *
 *  @returns {vec(2,3,4)} - the point at the parameter values on the surface
 */
var getSurfacePoint = function getSurfacePoint (p, U, q, V, P, u, v, S) {
  var vec = getAutoVectorType(P[0][0]);
  return getSurfacePointGeneric(p, U, q, V, P, u, v, S, vec);
};

module.exports = {
  getSurfacePoint: getSurfacePoint,
  getSurfacePoint2: function getSurfacePoint2 (p, U, q, V, P, u, v, S) {
    return getSurfacePointGeneric(p, U, q, V, P, u, v, S, glm.vec2);
  },
  getSurfacePoint3: function getSurfacePoint3 (p, U, q, V, P, u, v, S) {
    return getSurfacePointGeneric(p, U, q, V, P, u, v, S, glm.vec3);
  },
  getSurfacePoint4: function getSurfacePoint4 (p, U, q, V, P, u, v, S) {
    return getSurfacePointGeneric(p, U, q, V, P, u, v, S, glm.vec4);
  },
  getSurfacePointGeneric: getSurfacePointGeneric
};
