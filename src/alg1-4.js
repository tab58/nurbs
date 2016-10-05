'use strict';

var allBernstein = require('./alg1-3.js');

var evaluateBezierCurveGeneric = function evaluateBezierCurveGeneric (P, n, u, C, vec) {
  var B = new Float64Array(n + 1);
  allBernstein(n, u, B);
  var c = (C ? vec.set(C, 0.0, 0.0, 0.0, 0.0) : vec.create());
  var k = 0;
  for (k = 0; k <= n; ++k) {
    vec.scaleAndAdd(C, C, P[k], B[k]);
  }
  return c;
};

module.exports = evaluateBezierCurveGeneric;
