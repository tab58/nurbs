'use strict';

var chai = require('chai');
var nurbs = require('../index.js');
var closeTo = require('../lib/closeTo.js');

describe('Basis Function Tests', function () {
  it('Find Knot Span', function () {
    var p = 2;
    var U = [0, 0, 0, 1, 2, 3, 4, 4, 5, 5, 5];
    var u = 5 / 2;
    chai.assert(nurbs.findKnotSpan(p, u, U) === 4, 'Did not find correct knot span.');
  });
  it('B-spline Basis Functions', function () {
    var p = 2;
    var U = [0, 0, 0, 1, 2, 3, 4, 4, 5, 5, 5];
    var u = 5 / 2;
    var i = nurbs.findKnotSpan(p, u, U);
    var N = [0.0, 0.0, 0.0];
    nurbs.getBasisFunctions(i, u, p, U, N);
    var correctValues = closeTo(N[0], 0.125) &&
                        closeTo(N[1], 0.750) &&
                        closeTo(N[2], 0.125);
    chai.assert(correctValues, 'Did not find correct basis function values.');
  });
});
