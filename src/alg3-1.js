'use strict';

var findKnotSpan = require('./alg2-1.js');
var getBasisFunctions = require('./alg2-2.js');

var getCurvePointGeneric = function getCurvePointGeneric (u, p, U, P, N, c, vec) {
  var span = findKnotSpan(p, u, U);
  getBasisFunctions(u, p, U, N);
  var C = (c ? vec.set(c, 0.0, 0.0, 0.0, 0.0) : vec.create());
  var i = 0;
  for (i = 0; i <= p; ++i) {
    vec.scaleAndAdd(C, C, P[span - p + i], N[i]);
  }
  return C;
};

module.exports = getCurvePointGeneric;
