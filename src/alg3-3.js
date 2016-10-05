'use strict';

var getCurveDerivCtrlPointsGeneric = function getCurveDerivCtrlPointsGeneric (p, U, P, d, r1, r2, Pk, vec) {
  var r = r2 - r1;
  var i = 0;
  var k = 0;
  var temp;
  var PK = Pk;

  for (i = 0; i <= r; ++i) {
    vec.copy(PK[0][i], P[r1 + i]);
  }
  for (k = 1; k <= d; ++k) {
    temp = p - k + 1;
    for (i = 0; i <= r - k; ++i) {
      // don't think we need to clear PK[k][i] since it's output of vec.sub()
      vec.sub(PK[k][i], PK[k - 1][i + 1], PK[k - 1][i]);
      vec.scale(PK[k][i], PK[k][i], temp / (U[r1 + i + p + 1] - U[r1 + i + k]));
    }
  }
  return PK;
};

module.exports = getCurveDerivCtrlPointsGeneric;
