'use strict';

/**
 *  Computes the point on a power basis curve.
 *
 *  @param {Array|Number} a - the coefficients of the power basis (a<sub>0</sub> + a<sub>1</sub>u +...+ a<sub>n</sub>u<sup>n</sup>)
 *  @param {Number} u - the parameter value at which to evaluate the curve
 *
 *  @returns {Number} - the function value at the parameter value
 *
 */
var evaluatePowerBasis = function evaluatePowerBasis (a, u) {
  if (a.length <= 0) {
    throw new Error('Coefficient array length must be at least 1.');
  }
  var n = a.length - 1;
  var C = a[n];
  var i = 0;
  for (i = n - 1; i >= 0; --i) {
    C = C * u + a[i];
  }
  return C;
};

module.exports = evaluatePowerBasis;
