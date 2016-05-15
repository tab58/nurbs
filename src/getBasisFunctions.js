'use strict';

module.exports = function getBasisFunctions (i, u, p, U, NN) {
  var N = NN || new Float64Array(p + 1);
  var left = new Float64Array(p + 1);
  var right = new Float64Array(p + 1);
  var j = p + 1;
  var r;
  var saved;
  var temp;
  while (j--) {
    left[j] = 0.0;
    right[j] = 0.0;
    N[j] = 0.0;
  }

  N[0] = 1.0;
  for (j = 1; j <= p; ++j) {
    left[j] = u - U[i + 1 - j];
    right[j] = U[i + j] - u;
    saved = 0.0;
    for (r = 0; r < j; ++r) {
      temp = N[r] / (right[r + 1] + left[j - r]);
      N[r] = saved + right[r + 1] * temp;
      saved = left[j - r] * temp;
    }
    N[j] = saved;
  }
  return N;
};
