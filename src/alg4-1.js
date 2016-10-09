'use strict';

var findKnotSpan = require('./alg2-1.js');
var getBasisFunctions = require('./alg2-2.js');
var getCurvePointGeneric = require('./alg3-1.js');

var getRationalCurvePointGeneric = function getRationalCurvePointGeneric (u, p, U, P, W, c, vec) {
  var N = new Float64Array(p + 1);
  if (W === undefined || W === null || W.length === 0) {
    console.warn('Empty weight array. Using "getCurvePoint".');
    return getCurvePointGeneric(u, p, U, P, N, undefined, vec);
  }
  var span = findKnotSpan(p, u, U);
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

module.exports = getRationalCurvePointGeneric;
