'use strict';

var DEFAULT_PRECISION = 1e-14;

module.exports = function vec2CloseTo (p0, p1, tol) {
  var t = tol || DEFAULT_PRECISION;
  var x = (p1[0] - p0[0]);
  var y = (p1[1] - p0[1]);
  var dist = Math.sqrt(x * x + y * y);
  return (Math.abs(dist) < t);
};
