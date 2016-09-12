'use strict';

var chai = require('chai');
var nurbs = require('../index.js');
var closeTo = require('../lib/closeTo.js');

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
    var D = nurbs.getDerivsOfBasisFunctions(u, p, U, n);
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
