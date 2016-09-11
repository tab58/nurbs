'use strict';

var chai = require('chai');
var nurbs = require('../index.js');
var closeTo = require('../lib/closeTo.js');
var glm = require('gl-matrix');

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
    var W = [
      1,
      ww,
      ww,
      1
    ];
    var C = nurbs.getRationalCurvePoint(u, p, U, P, W);
    var correct = closeTo(C, glm.vec2.fromValues(sq2, sq2));
    chai.assert(correct, 'Did not find correct rational curve point: tolerance ');
  });
});
