'use strict';

var array2d = require('../lib/create2dArray.js');
var findKnotSpan = require('./alg2-1.js');
var curveDerivCpts = require('./alg3-3.js');

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

var getCurveDerivsAtPointGeneric = function getCurveDerivsAtPointGeneric (p, U, P, u, d, Ck, vec) {
  var du = Math.min(d, p);
  var k = 0;
  var j = 0;
  var CK = Ck;

  var span = findKnotSpan(p, u, U);
  var N = allBasisFunctions(p, u, U);
  var PK = array2d(du + 1, p + 1, vec.create);
  curveDerivCpts(p, U, P, du, span - p, span, PK, vec);
  for (k = 0; k <= du; ++k) {
    vec.set(CK[k], 0, 0, 0, 0);
    for (j = 0; j <= p - k; ++j) {
      vec.scaleAndAdd(CK[k], CK[k], PK[k][j], N[j][p - k]);
    }
  }
  return CK;
};

module.exports = getCurveDerivsAtPointGeneric;
