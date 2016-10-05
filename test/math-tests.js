'use strict';

var chai = require('chai');
var nurbs = require('../nurbs.js');
var closeTo = require('../lib/closeTo.js');
var array2d = require('../lib/create2dArray.js');
var glm = require('gl-matrix');
var autoVecSelect = require('../lib/getAutoVectorType.js');

describe('Miscellaneous Function Tests', function () {
  it('A0.1: Binomial Coefficient Calculation', function () {
    var binomial = require('../src/allBinomials.js');
    var n = 5;
    var B = binomial(n);
    chai.assert(closeTo(B[0], 1), 'Did not properly evaluate Bin(5, 0).');
    chai.assert(closeTo(B[1], 5), 'Did not properly evaluate Bin(5, 1).');
    chai.assert(closeTo(B[2], 10), 'Did not properly evaluate Bin(5, 2).');
    chai.assert(closeTo(B[3], 10), 'Did not properly evaluate Bin(5, 3).');
    chai.assert(closeTo(B[4], 5), 'Did not properly evaluate Bin(5, 4).');
    chai.assert(closeTo(B[5], 1), 'Did not properly evaluate Bin(5, 5).');
  });
});
describe('Bezier and Power Basis Function Tests', function () {
  it('A1.1: Horner Evaluation', function () {
    var a = [0, 1, 0, 1];
    var u = 3;
    chai.assert(closeTo(nurbs.evaluatePowerBasis(a, u), 30), 'Did not properly evaluate at u = ' + u + '.');
  });
  it('A1.2: Bernstein Function Evaluation', function () {
    var n = 3;
    chai.assert(closeTo(nurbs.getOneBernsteinFunc(0, n, 0.0), 1.0), 'Did not properly evaluate at the start point.');
    chai.assert(closeTo(nurbs.getOneBernsteinFunc(n, n, 1.0), 1.0), 'Did not properly evaluate at the end point.');

    var u = 1.0 / 3;
    var b0 = nurbs.getOneBernsteinFunc(0, n, u);
    var b1 = nurbs.getOneBernsteinFunc(1, n, u);
    var b2 = nurbs.getOneBernsteinFunc(2, n, u);
    var b3 = nurbs.getOneBernsteinFunc(3, n, u);

    chai.assert(closeTo(b0, 8 / 27), 'Did not properly evaluate B[0] at u = ' + u + '.');
    chai.assert(closeTo(b1, 4 / 9), 'Did not properly evaluate B[1] at u = ' + u + '.');
    chai.assert(closeTo(b2, 2 / 9), 'Did not properly evaluate B[2] at u = ' + u + '.');
    chai.assert(closeTo(b3, 1 / 27), 'Did not properly evaluate B[3] at u = ' + u + '.');
  });
  it('A1.3: All Bernstein Functions Evaluation', function () {
    var n = 3;
    var B = new Float64Array(n + 1);
    var u = 1.0 / 3;

    nurbs.getAllBernsteinFuncs(n, u, B);
    chai.assert(closeTo(B[0], 8 / 27), 'Did not properly evaluate B[0] at u = ' + u + '.');
    chai.assert(closeTo(B[1], 4 / 9), 'Did not properly evaluate B[1] at u = ' + u + '.');
    chai.assert(closeTo(B[2], 2 / 9), 'Did not properly evaluate B[2] at u = ' + u + '.');
    chai.assert(closeTo(B[3], 1 / 27), 'Did not properly evaluate B[3] at u = ' + u + '.');
  });
  it('A1.4: Bezier Curve Evaluation', function () {
    var P = [
      glm.vec2.fromValues(0, 0),
      glm.vec2.fromValues(1, 1),
      glm.vec2.fromValues(2, 0),
      glm.vec2.fromValues(3, 1)
    ];
    var u = 0.5;
    var C = glm.vec2.create();
    nurbs.evaluateBezierCurve(P, P.length - 1, u, C);

    chai.assert(closeTo(C, glm.vec2.fromValues(1.5, 0.5)), 'Did not properly evaluate point at u = ' + u + '.');
  });
});
describe('Basis Function Tests', function () {
  it('A2.1: Find Knot Span', function () {
    var p = 2;
    var U = [0, 0, 0, 1, 2, 3, 4, 4, 5, 5, 5];
    var u = 5 / 2;
    chai.assert(nurbs.findKnotSpan(p, u, U) === 4, 'Did not find correct knot span.');
  });
  it('A2.2: B-spline Basis Functions', function () {
    var p = 2;
    var U = [0, 0, 0, 1, 2, 3, 4, 4, 5, 5, 5];
    var u = 5 / 2;
    var N = [0.0, 0.0, 0.0];
    nurbs.getBasisFunctions(u, p, U, N);
    var correctValues = closeTo(N[0], 0.125) &&
                        closeTo(N[1], 0.750) &&
                        closeTo(N[2], 0.125);
    chai.assert(correctValues, 'Did not find correct basis function values.');
  });
  it('A2.3: Derivatives of All Basis Functions', function () {
    var p = 2;
    var U = [0, 0, 0, 1, 2, 3, 4, 4, 5, 5, 5];
    var u = 5 / 2;
    var n = p;
    var D = array2d(n + 1, p + 1);
    nurbs.getDerivsOfBasisFunctions(u, p, U, n, D);
    var correctValues = closeTo(D[0][0], 0.125) &&
                        closeTo(D[0][1], 0.750) &&
                        closeTo(D[0][2], 0.125);
    chai.assert(correctValues, 'Did not find correct basis function values.');
    correctValues = closeTo(D[1][0], -0.5) &&
                    closeTo(D[1][1], 0) &&
                    closeTo(D[1][2], 0.5);
    chai.assert(correctValues, 'Did not find correct 1st derivative values.');
    correctValues = closeTo(D[2][0], 1) &&
                    closeTo(D[2][1], -2) &&
                    closeTo(D[2][2], 1);
    chai.assert(correctValues, 'Did not find correct 2nd derivative values.');
  });
  it('A2.4: One Basis Function', function () {
    var p = 2;
    var U = [0, 0, 0, 1, 2, 3, 4, 4, 5, 5, 5];
    var u = 5 / 2;
    var i = 4;
    var N = nurbs.getOneBasisFunction(i, u, p, U);
    chai.assert(closeTo(N, 0.125), 'Did not find the right basis function.');
  });
  it('A2.5: Derivatives of Single Basis Function', function () {
    var p = 2;
    var U = [0, 0, 0, 1, 2, 3, 4, 4, 5, 5, 5];
    var u = 5 / 2;
    var n = p;
    var i = 4;
    var D = new Float64Array(n + 1);
    nurbs.getDerivsOf1BasisFunction(i, u, p, U, n, D);
    var correctValues = closeTo(D[0], 0.125) &&
                        closeTo(D[1], 0.5) &&
                        closeTo(D[2], 1);
    chai.assert(correctValues, 'Did not find correct basis function derivatives.');
  });
});
describe('Curve Function Tests', function () {
  it('A3.1: Curve Point Evaluation', function () {
    var p = 3;
    var U = [0, 0, 0, 0, 1, 1, 1, 1];
    var u = 0.5;
    var P = [
      glm.vec2.fromValues(0, 0),
      glm.vec2.fromValues(1, 1),
      glm.vec2.fromValues(2, 1),
      glm.vec2.fromValues(3, 0)
    ];
    var N = new Float64Array(p + 1);
    nurbs.getBasisFunctions(u, p, U, N);
    var C = glm.vec2.create();
    nurbs.getCurvePoint(u, p, U, P, N, C);
    var correct = closeTo(C, glm.vec2.fromValues(1.5, 0.75));
    chai.assert(correct, 'Did not find correct nonrational curve point.');
  });
  it('A3.2: Curve Derivative Point Evaluation', function () {
    var p = 3;
    var U = [0, 0, 0, 0, 1, 1, 1, 1];
    var u = 0.5;
    var P = [
      glm.vec2.fromValues(0, 0),
      glm.vec2.fromValues(1, 1),
      glm.vec2.fromValues(2, 1),
      glm.vec2.fromValues(3, 0)
    ];
    var d = 1;
    var C = [];
    var i = 0;
    for (i = 0; i <= d; ++i) {
      C.push(glm.vec2.create());
    }
    nurbs.getCurveDerivatives(u, p, U, P, d, C);
    var correct = closeTo(C[0], glm.vec2.fromValues(1.5, 0.75));
    chai.assert(correct, 'Did not find correct curve point.');
    correct = closeTo(C[1], glm.vec2.fromValues(3.0, 0.0));
    chai.assert(correct, 'Did not find correct 1st derivative point.');
  });
  it('A3.3: Curve Derivative Control Points', function () {
    // Simple Bezier curve derivative test
    var p = 3;
    var U = [0, 0, 0, 0, 1, 1, 1, 1];
    var P = [
      glm.vec2.fromValues(0, 0),
      glm.vec2.fromValues(1, 1),
      glm.vec2.fromValues(2, 1),
      glm.vec2.fromValues(3, 0)
    ];
    var r1 = 0;
    var r2 = p;
    var d = 1;
    var PK = array2d(d + 1, r2 - r1 + 1, glm.vec2.create);
    nurbs.getCurveDerivCtrlPoints(p, U, P, d, r1, r2, PK);

    var i = 0;
    var vec = autoVecSelect(P[0]);
    var v = vec.create();
    for (i = 0; i < p; ++i) {
      vec.sub(v, P[i + 1], P[i]);
      vec.scale(v, v, p);
      var correct = closeTo(PK[1][i], v);
      chai.assert(correct, 'Did not find correct 1st derivative at point ' + i + '.');
    }
  });
  it('A3.4: Curve Derivative at Parameter Values', function () {
    // Simple Bezier curve derivative test
    var p = 3;
    var U = [
      [0, 0, 0, 0, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1],
      [0, 0, 1, 1]
    ];
    var P = [
      glm.vec2.fromValues(0, 0),
      glm.vec2.fromValues(1, 1),
      glm.vec2.fromValues(2, 1),
      glm.vec2.fromValues(3, 0)
    ];

    var u = 0.5;
    var d = p;
    var CK = [];
    var i = p + 1;
    while (i--) {
      CK.push(glm.vec2.create());
    }
    nurbs.getCurveDerivsAtPoint(p, U[0], P, u, d, CK);

    var r1 = 0;
    var r2 = p;
    d = p;
    var PK = array2d(d + 1, r2 - r1 + 1, glm.vec2.create);
    nurbs.getCurveDerivCtrlPoints(p, U[0], P, d, r1, r2, PK);

    // compare the values to a curve evaluation of the curve control points
    i = 0;
    var C = glm.vec2.create();
    var N = [0, 0, 0, 0];
    for (i = 0; i <= 2; ++i) {
      nurbs.getBasisFunctions(u, p - i, U[i], N);
      nurbs.getCurvePoint(u, p - i, U[i], PK[i], N, C);
      var correct = closeTo(C, CK[i]);
      chai.assert(correct, 'Did not find correct value of derivative ' + i + '.');
    }
  });
  it('A3.5: Surface Point Evaluation', function () {
    var p = 3;
    var q = 3;
    var U = [0, 0, 0, 0, 1, 1, 1, 1];
    var V = [0, 0, 0, 0, 1, 1, 1, 1];
    var u = 0.5;
    var v = 0.5;
    var P = [
      [glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(1, 0, 0), glm.vec3.fromValues(2, 0, 0), glm.vec3.fromValues(3, 0, 0)],
      [glm.vec3.fromValues(0, 1, 0), glm.vec3.fromValues(1, 1, 0), glm.vec3.fromValues(2, 1, 0), glm.vec3.fromValues(3, 1, 0)],
      [glm.vec3.fromValues(0, 2, 0), glm.vec3.fromValues(1, 2, 0), glm.vec3.fromValues(2, 2, 0), glm.vec3.fromValues(3, 2, 0)],
      [glm.vec3.fromValues(0, 3, 0), glm.vec3.fromValues(1, 3, 0), glm.vec3.fromValues(2, 3, 2), glm.vec3.fromValues(3, 3, 4)]
    ];
    var S = glm.vec3.create();
    nurbs.getSurfacePoint(p, U, q, V, P, u, v, S);

    var S1 = glm.vec3.create();
    var Nu = [0, 0, 0, 0];
    nurbs.getBasisFunctions(u, p, U, Nu);
    var Nv = [0, 0, 0, 0];
    nurbs.getBasisFunctions(v, q, V, Nv);
    var i = 0;
    var temp = glm.vec3.create();
    for (i = 0; i <= p; ++i) {
      nurbs.getCurvePoint(v, q, V, P[i], Nv, temp);
      glm.vec3.scaleAndAdd(S1, S1, temp, Nu[i]);
    }
    var correct = closeTo(S, S1);
    chai.assert(correct, 'Did not find correct value of surface point.');
  });
  it('A3.6: Calculate Surface Partial Derivatives', function () {
    // basically an extruded parabola
    // univariate parabola: [ -2, 4 ],[ -1, 0 ],[ 0, -1.333 ],[ 1, 0 ],[ 2, 4 ]
    var p = 4;
    var q = 4;
    var U = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1];
    var V = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1];
    var Pu0 = [
      glm.vec3.fromValues(-2, -2, 4),
      glm.vec3.fromValues(-1, -2, 0),
      glm.vec3.fromValues(0, -2, -4 / 3),
      glm.vec3.fromValues(1, -2, 0),
      glm.vec3.fromValues(2, -2, 4)
    ];
    var Pu1 = [
      glm.vec3.fromValues(-2, -1, 4),
      glm.vec3.fromValues(-1, -1, 0),
      glm.vec3.fromValues(0, -1, -4 / 3),
      glm.vec3.fromValues(1, -1, 0),
      glm.vec3.fromValues(2, -1, 4)
    ];
    var Pu2 = [
      glm.vec3.fromValues(-2, 0, 4),
      glm.vec3.fromValues(-1, 0, 0),
      glm.vec3.fromValues(0, 0, -4 / 3),
      glm.vec3.fromValues(1, 0, 0),
      glm.vec3.fromValues(2, 0, 4)
    ];
    var Pu3 = [
      glm.vec3.fromValues(-2, 1, 4),
      glm.vec3.fromValues(-1, 1, 0),
      glm.vec3.fromValues(0, 1, -4 / 3),
      glm.vec3.fromValues(1, 1, 0),
      glm.vec3.fromValues(2, 1, 4)
    ];
    var Pu4 = [
      glm.vec3.fromValues(-2, 2, 4),
      glm.vec3.fromValues(-1, 2, 0),
      glm.vec3.fromValues(0, 2, -4 / 3),
      glm.vec3.fromValues(1, 2, 0),
      glm.vec3.fromValues(2, 2, 4)
    ];
    var P = [
      Pu0,
      Pu1,
      Pu2,
      Pu3,
      Pu4
    ];
    var u = 0.5;
    var v = 0.75;
    var d = 1;
    var SKL = array2d(d + 1, d + 1, glm.vec3.create);
    nurbs.getSurfacePartialDerivsAtPoint(p, U, q, V, P, u, v, d, SKL);

    var correct = closeTo(SKL[0][1], glm.vec3.fromValues(4, 0, 8));
    chai.assert(correct, 'Did not find dS/du.');
    correct = closeTo(SKL[1][0], glm.vec3.fromValues(0, 4, 0));
    chai.assert(correct, 'Did not find dS/dv.');
    correct = closeTo(SKL[1][1], glm.vec3.fromValues(0, 0, 0));
    chai.assert(correct, 'Did not find d2S/dudv.');
  });
});
describe('Rational Curve Function Tests', function () {
  it('A4.1: Rational Curve Point Evaluation', function () {
    var p = 3;
    var U = [0, 0, 0, 0, 1, 1, 1, 1];
    var u = 0.5;
    var th = Math.PI / 2;
    var r = 1;
    var e = (2 * Math.sin(th / 2)) / (1 + 2 * Math.cos(th / 2)) * r;
    var sq2 = Math.sqrt(2) / 2;
    var P = [
      glm.vec2.fromValues(0, r),
      glm.vec2.fromValues(e, r),
      glm.vec2.fromValues(r, e),
      glm.vec2.fromValues(r, 0)
    ];
    var ww = (1 + 2 * Math.cos(th / 2)) / 3;
    var W = [1, ww, ww, 1];
    var C = glm.vec2.create();
    nurbs.getRationalCurvePoint(u, p, U, P, W, C);
    var correct = closeTo(C, glm.vec2.fromValues(sq2, sq2));
    chai.assert(correct, 'Did not find correct rational curve point: tolerance ');
  });
  it('A4.2: Rational Curve Derivative Evaluation', function () {
    var u = 0.5;
    var p = 5;
    var U = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
    var P = [
      glm.vec2.fromValues(0, 0),
      glm.vec2.fromValues(4, 0),
      glm.vec2.fromValues(2, 4),
      glm.vec2.fromValues(-2, 4),
      glm.vec2.fromValues(-4, 0),
      glm.vec2.fromValues(0, 0)
    ];
    var W = [1, 0.2, 0.2, 0.2, 0.2, 1];
    var d = 2;
    var C = [
      glm.vec2.create(),
      glm.vec2.create(),
      glm.vec2.create()
    ];
    nurbs.getRationalCurveDerivAtPoint(u, p, U, P, W, d, C);
    chai.assert(closeTo(C[0], glm.vec2.fromValues(0, 2)), 'Did not find correct rational curve point.');
    chai.assert(closeTo(C[1], glm.vec2.fromValues(-8, 0)), 'Did not find correct rational curve 1st derivative.');
    chai.assert(closeTo(C[2], glm.vec2.fromValues(0, -64)), 'Did not find correct rational curve 2nd derivative.');
  });
});
