'use strict';

require('gl-matrix').glMatrix.ARRAY_TYPE = Float64Array;

// Algorithm A2.1
module.exports.findKnotSpan = require('./src/alg2-1.js');
// Algorithm A2.2
module.exports.getBasisFunctions = require('./src/alg2-2.js');
// Algorithm A2.3
module.exports.getDerivsOfBasisFunctions = require('./src/alg2-3.js');
// Algorithm A2.4
module.exports.getOneBasisFunction = require('./src/alg2-4.js');
// Algorithm A2.5
module.exports.getDerivsOf1BasisFunction = require('./src/alg2-5.js');

// Algorithm A3.1
var alg3s1 = require('./src/alg3-1.js');
module.exports.getCurvePoint = alg3s1.getCurvePoint;
module.exports.getCurvePoint2 = alg3s1.getCurvePoint2;
module.exports.getCurvePoint3 = alg3s1.getCurvePoint3;
module.exports.getCurvePoint4 = alg3s1.getCurvePoint4;
// Algorithm A3.2
var alg3s2 = require('./src/alg3-2.js');
module.exports.getCurveDerivatives = alg3s2.getCurveDerivatives;
module.exports.getCurveDerivatives2 = alg3s2.getCurveDerivatives2;
module.exports.getCurveDerivatives3 = alg3s2.getCurveDerivatives3;
module.exports.getCurveDerivatives4 = alg3s2.getCurveDerivatives4;
// Algorithm A3.3
var alg3s3 = require('./src/alg3-3.js');
module.exports.getCurveDerivCtrlPoints = alg3s3.getCurveDerivCtrlPoints;
module.exports.getCurveDerivCtrlPoints2 = alg3s3.getCurveDerivCtrlPoints2;
module.exports.getCurveDerivCtrlPoints3 = alg3s3.getCurveDerivCtrlPoints3;
module.exports.getCurveDerivCtrlPoints4 = alg3s3.getCurveDerivCtrlPoints4;
// Algorithm A3.4
var alg3s4 = require('./src/alg3-4.js');
module.exports.getCurveDerivsAtPoint = alg3s4.getCurveDerivsAtPoint;
module.exports.getCurveDerivsAtPoint2 = alg3s4.getCurveDerivsAtPoint2;
module.exports.getCurveDerivsAtPoint3 = alg3s4.getCurveDerivsAtPoint3;
module.exports.getCurveDerivsAtPoint4 = alg3s4.getCurveDerivsAtPoint4;
// Algorithm A3.5
var alg3s5 = require('./src/alg3-5.js');
module.exports.getSurfacePoint = alg3s5.getSurfacePoint;
module.exports.getSurfacePoint2 = alg3s5.getSurfacePoint2;
module.exports.getSurfacePoint3 = alg3s5.getSurfacePoint3;
module.exports.getSurfacePoint4 = alg3s5.getSurfacePoint4;
// Algorithm A3.6
var alg3s6 = require('./src/alg3-6.js');
module.exports.getSurfacePartialDerivsAtPoint = alg3s6.getSurfacePartialDerivsAtPoint;
module.exports.getSurfacePartialDerivsAtPoint2 = alg3s6.getSurfacePartialDerivsAtPoint2;
module.exports.getSurfacePartialDerivsAtPoint3 = alg3s6.getSurfacePartialDerivsAtPoint3;
module.exports.getSurfacePartialDerivsAtPoint4 = alg3s6.getSurfacePartialDerivsAtPoint4;

// Algorithm A4.1
var alg4s1 = require('./src/alg4-1.js');
module.exports.getRationalCurvePoint = alg4s1.getRationalCurvePoint;
module.exports.getRationalCurvePoint2 = alg4s1.getRationalCurvePoint2;
module.exports.getRationalCurvePoint3 = alg4s1.getRationalCurvePoint3;
module.exports.getRationalCurvePoint4 = alg4s1.getRationalCurvePoint4;
// Algorithm A4.2
// module.exports.getRationalCurveDerivAtPoint = require('./src/4/getRationalCurveDerivs.js');
