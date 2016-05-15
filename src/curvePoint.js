'use strict';

var glm = require('gl-matrix');
var findKnotSpan = require('./findKnotSpan.js');
var getBasisFunctions = require('./getBasisFunctions.js');

module.exports = function getCurvePoint (u, p, P, U) {
  var span = findKnotSpan(p, u, U);
  var N = new Float64Array(p + 1);
  getBasisFunctions(span, u, p, U, N);
  var C = glm.vec2.create();
  var i = 0;
  for (i = 0; i <= p; ++i) {
    glm.vec2.scaleAndAdd(C, C, P[span - p + i], N[i]);
  }
  return C;
};
