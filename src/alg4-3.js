'use strict';

var findKnotSpan = require('./alg2-1.js');
var getBasisFunctions = require('./alg2-2.js');
var getSurfacePoint = require('./alg3-5.js');

var getRationalSurfacePointGeneric = function getRationalSurfacePointGeneric (p, U, q, V, P, W, u, v, S, vec) {
  if (W === undefined || W === null || W.length === 0) {
    console.warn('Empty weight array. Using "getSurfacePoint".');
    return getSurfacePoint(p, U, q, V, P, u, v, S, vec);
  }

  var uspan = findKnotSpan(p, u, U);
  var Nu = new Float64Array(p + 1);
  var vspan = findKnotSpan(q, v, V);
  var Nv = new Float64Array(q + 1);
  getBasisFunctions(u, p, U, Nu);
  getBasisFunctions(v, q, V, Nv);

  var l = 0;
  var k = 0;
  var tmp;
  var tmpW = 0.0;
  var wi = 0.0;
  var w = 0;
  var Sw = vec.create();

  // TODO: make this more efficient by iterating over the P[i] array instead
  // getting elements from each P[i][] array
  for (l = 0; l <= q; ++l) {
    tmp = vec.create();
    tmpW = 0.0;
    for (k = 0; k <= p; ++k) {
      wi = Nu[k] * W[uspan - p + k][vspan - q + l];
      tmpW += wi;
      vec.scaleAndAdd(tmp, tmp, P[uspan - p + k][vspan - q + l], wi);
    }
    vec.scaleAndAdd(Sw, Sw, tmp, Nv[l]);
    w += tmpW * Nv[l];
  }

  if (w === 0) {
    throw new Error('Weighted basis functions add to zero.');
  }
  vec.scale(S, Sw, 1.0 / w);
};

module.exports = getRationalSurfacePointGeneric;
