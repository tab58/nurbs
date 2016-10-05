'use strict';

var array2d = require('../lib/create2dArray.js');
var findKnotSpan = require('./alg2-1.js');
var getDerivsOfBasisFunctions = require('./alg2-3.js');

var getCurveDerivativesGeneric = function getCurveDerivativesGeneric (u, p, U, P, d, C, vec) {
  var du = Math.min(d, p);
  var k = 0;
  var j = 0;
  var CK = C;
  var span = findKnotSpan(p, u, U);
  var D = array2d(du + 1, p + 1);
  getDerivsOfBasisFunctions(u, p, U, du, D);
  for (k = 0; k <= du; ++k) {
    vec.set(CK[k], 0, 0, 0, 0);
    for (j = 0; j <= p; ++j) {
      vec.scaleAndAdd(CK[k], CK[k], P[span - p + j], D[k][j]);
    }
  }
  return CK;
};

module.exports = getCurveDerivativesGeneric;
