'use strict';

var chai = require('chai');
var nurbs = require('../index.js');
var closeTo = require('../lib/closeTo.js');
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
    var C = nurbs.getCurvePoint(u, p, U, P);
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
    var C = nurbs.getCurveDerivatives(u, p, U, P, 1);
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
    var PK = nurbs.getCurveDerivCtrlPoints(p, U, P, d, r1, r2);

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
});
