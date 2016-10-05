'use strict';

var allBinomials = function allBinomials (n, B) {
  var i = 0;
  var bin = B || new Float64Array(n + 1);
  bin[0] = 1;
  var tmp = 0;
  for (i = 1; i <= n; ++i) {
    tmp = bin[i - 1] * ((n + 1 - i) / i);
    bin[i] = Math.round(tmp);
  }
  return bin;
};

module.exports = allBinomials;
