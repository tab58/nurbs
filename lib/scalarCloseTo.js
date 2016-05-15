'use strict';

var DEFAULT_PRECISION = 1e-14;

module.exports = function scalarCloseTo (x, y, tol) {
  var t = tol || DEFAULT_PRECISION;
  return (Math.abs(x - y) < t);
};