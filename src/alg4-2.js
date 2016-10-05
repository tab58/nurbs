'use strict';

var findKnotSpan = require('./alg2-1.js');
var getDerivsOfBasisFunctions = require('./alg2-3.js');
var binomial = require('../src/allBinomials.js');

var getRationalCurveDerivAtPointGeneric = function getRationalCurveDerivAtPointGeneric (u, p, U, P, W, d, C, vec) {
  var Aders = [];
  var wders = [];
  var CK = C || [];
  var D = [];
  var k = 0;
  var j = 0;
  var tmp;
  for (k = 0; k <= d; ++k) {
    tmp = [];
    for (j = 0; j <= p; ++j) {
      tmp.push(0.0);
    }
    D.push(tmp);
    Aders.push(vec.create());
    wders.push(0.0);
    vec.set(CK[k], 0.0, 0.0, 0.0, 0.0);
  }
  var n = Math.min(d, p);
  getDerivsOfBasisFunctions(u, p, U, n, D);

  // compute A(u) and w(u):
  //    A^k(u) = sum_i^n N^k(u) * w_i * P_i
  //    w^k(u) = N^k(u) * w_i
  var span = findKnotSpan(p, u, U);
  var i = 0;
  var N;
  var A;
  var w = 0;
  for (k = 0; k <= n; ++k) {
    N = D[k];
    A = Aders[k];
    for (i = 0; i <= p; ++i) {
      w = N[i] * W[span - p + i];
      wders[k] += w;
      vec.scaleAndAdd(A, A, P[span - p + i], w);
    }
  }

  if (wders[0] === 0.0) {
    throw new Error('Denominator is zero, cannot calculate rational derivative.');
  }
  // compute C^k(u) = (A^k(u) - sum_i=1^k Bin[k][i] w^i(u) C^(k-i)(u)) / w(u)
  var bin;
  for (k = 0; k <= n; ++k) {
    A = Aders[k];
    bin = binomial(k);
    for (i = 1; i <= k; ++i) {
      vec.scaleAndAdd(A, A, CK[k - i], -wders[i] * bin[i]);
    }
    vec.scale(CK[k], A, 1.0 / wders[0]);
  }
  return CK;
};

module.exports = getRationalCurveDerivAtPointGeneric;
