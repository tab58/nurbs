'use strict';

var chai = require('chai');
var nurbs = require('../index.js');
var vec2CloseTo = require('../lib/vec2CloseTo.js');
var glm = require('gl-matrix');

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
    var C = nurbs.curvePoint(u, p, P, U);
    var correct = vec2CloseTo(C, glm.vec2.fromValues(1.5, 0.75));
    chai.assert(correct, 'Did not find correct curve point.');
  });
});
