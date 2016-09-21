'use strict';

var DEFAULT_PRECISION = 1e-14;
var isNumeric = require('./isNumeric.js');
var isArrayLike = require('./isArrayLike.js');

var hypot = function hypot (a, b) {
  if (a === 0 && b === 0) {
    return 0;
  }
  var x = Math.abs(a);
  var y = Math.abs(b);
  var t = Math.min(x, y);
  var u = Math.max(x, y);
  t = t / u;
  return u * Math.sqrt(1 + t * t);
};

var rms = function rms (arr) {
  var i = 0;
  var x = 0;
  var sum = 0;
  for (i = 0; i < arr.length; ++i) {
    x = arr[i];
    if (!isNumeric(x)) {
      throw new Error('closeTo: non-numeric array element.');
    }
    sum = hypot(sum, x);
  }
  return sum;
};

var vectorDiffRMS = function vectorDiffRMS (x, y) {
  var i = 0;
  var elemDiff = 0;
  var diffRMS = 0;
  if (x.length !== y.length) {
    throw new Error('closeTo: invalid array comparison between arguments.');
  }
  for (i = 0; i < x.length; ++i) {
    elemDiff = x[i] - y[i];
    diffRMS = hypot(diffRMS, elemDiff);
  }
  return diffRMS;
};

module.exports = function closeTo (x, y, tol) {
  var dist = 0;

  // set precision
  var t = DEFAULT_PRECISION;
  if (tol !== undefined && Number.isNumeric(tol)) {
    t = tol;
  }

  if (isNumeric(x) && isNumeric(y)) {
    return (Math.abs(x - y) < t);
  } else if (isArrayLike(x) && isNumeric(y)) {
    dist = rms(x);
    return (Math.abs(dist - y) < t);
  } else if (isArrayLike(y) && isNumeric(x)) {
    dist = rms(y);
    return (Math.abs(dist - x) < t);
  } else if (isArrayLike(x) && isArrayLike(y)) {
    return (Math.abs(vectorDiffRMS(x, y)) < t);
  } else {
    throw new Error('closeTo: arguments are invalid.');
  }
};
