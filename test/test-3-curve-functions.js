'use strict';

var chai = require('chai');
var nurbs = require('../index.js');
var closeTo = require('../lib/closeTo.js');
// var array1d = require('../lib/create1dArray.js');
var array2d = require('../lib/create2dArray.js');
var glm = require('gl-matrix');
var autoVecSelect = require('../lib/getAutoVectorType.js');

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
