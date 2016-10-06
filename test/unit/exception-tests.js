'use strict';

var chai = require('chai');
var nurbs = require('../../nurbs.js');
var glm = require('gl-matrix');
var array1d = require('../../lib/create1dArray.js');
// var array2d = require('../../lib/create2dArray.js');

var throwMsg = 'Did not throw correct error.';

describe('Unit Tests: Input Validation -- Bezier and Power Basis Functions', function () {
  it('should throw when horner is passed a.length of 0', function () {
    chai.assert.throws(
      function () {
        nurbs.evaluatePowerBasis([], 1.0);
      },
      Error,
      'Coefficient array length must be at least 1.',
      throwMsg);
  });
  it('should throw when oneBernsteinFunc has an i < 0', function () {
    chai.assert.throws(
      function () {
        nurbs.getOneBernsteinFunc(-1, 5, 0.5);
      },
      Error,
      'i must be between 0 and n.',
      throwMsg);
  });
  it('should throw when oneBernsteinFunc has an i > n', function () {
    chai.assert.throws(
      function () {
        nurbs.getOneBernsteinFunc(6, 5, 0.5);
      },
      Error,
      'i must be between 0 and n.',
      throwMsg);
  });
  it('should throw when oneBernsteinFunc has an u > 1.0', function () {
    chai.assert.throws(
      function () {
        nurbs.getOneBernsteinFunc(2, 5, 1.1);
      },
      Error,
      'u must be between 0 and 1.',
      throwMsg);
  });
  it('should throw when oneBernsteinFunc has an u < 0.0', function () {
    chai.assert.throws(
      function () {
        nurbs.getOneBernsteinFunc(2, 5, -1.1);
      },
      Error,
      'u must be between 0 and 1.',
      throwMsg);
  });
  it('should throw when oneBernsteinFunc has a non-integer i', function () {
    chai.assert.throws(
      function () {
        nurbs.getOneBernsteinFunc(2.1, 5, 0.5);
      },
      Error,
      'i must be an integer.',
      throwMsg);
  });
  it('should throw when oneBernsteinFunc has a non-integer n', function () {
    chai.assert.throws(
      function () {
        nurbs.getOneBernsteinFunc(2, 5.1, 0.5);
      },
      Error,
      'n must be an integer.',
      throwMsg);
  });
  it('should throw when getAllBernsteinFuncs has an B.length < n + 1', function () {
    chai.assert.throws(
      function () {
        var n = 5;
        var u = 0.5;
        var B = [];
        nurbs.getAllBernsteinFuncs(n, u, B);
      },
      Error,
      'B is not at least of length n + 1.',
      throwMsg);
  });
  it('should throw when getAllBernsteinFuncs has u < 0.0', function () {
    chai.assert.throws(
      function () {
        var n = 5;
        var u = -0.5;
        var B = new Float64Array(n + 1);
        nurbs.getAllBernsteinFuncs(n, u, B);
      },
      Error,
      'u must be between 0 and 1.',
      throwMsg);
  });
  it('should throw when getAllBernsteinFuncs has u > 1.0', function () {
    chai.assert.throws(
      function () {
        var n = 5;
        var u = 1.5;
        var B = new Float64Array(n + 1);
        nurbs.getAllBernsteinFuncs(n, u, B);
      },
      Error,
      'u must be between 0 and 1.',
      throwMsg);
  });
  it('should throw when getAllBernsteinFuncs has n < 0', function () {
    chai.assert.throws(
      function () {
        var n = -1;
        var u = 0.5;
        var B = new Float64Array(n + 1);
        nurbs.getAllBernsteinFuncs(n, u, B);
      },
      Error,
      'n must be greater than 0.',
      throwMsg);
  });
  it('should throw when getAllBernsteinFuncs has a non-integer n', function () {
    chai.assert.throws(
      function () {
        var n = 5.1;
        var u = 0.5;
        var B = new Float64Array(n + 1);
        nurbs.getAllBernsteinFuncs(n, u, B);
      },
      Error,
      'n must be an integer.',
      throwMsg);
  });

  it('should throw when generic evaluateBezierCurve has P.length equal to 0', function () {
    chai.assert.throws(
      function () {
        var P = [];
        var u = 0.5;
        var C = glm.vec2.create();
        nurbs.evaluateBezierCurve(P, u, C);
      },
      Error,
      'Auto-select vector type: Vector or vector length undefined.',
      throwMsg);
  });
  it('should throw when generic evaluateBezierCurve has u < 0', function () {
    chai.assert.throws(
      function () {
        var P = array1d(3, glm.vec2.create);
        var u = -0.5;
        var C = glm.vec2.create();
        nurbs.evaluateBezierCurve(P, u, C);
      },
      Error,
      'u must be between 0 and 1.',
      throwMsg);
  });
  it('should throw when generic evaluateBezierCurve has u > 1', function () {
    chai.assert.throws(
      function () {
        var P = array1d(3, glm.vec2.create);
        var u = 1.5;
        var C = glm.vec2.create();
        nurbs.evaluateBezierCurve(P, u, C);
      },
      Error,
      'u must be between 0 and 1.',
      throwMsg);
  });
  it('should throw when vec2.evaluateBezierCurve has P.length equal to 0', function () {
    chai.assert.throws(
      function () {
        var P = [];
        var u = 0.5;
        var C = glm.vec2.create();
        nurbs.vec2.evaluateBezierCurve(P, u, C);
      },
      Error,
      'P must have length greater than 0.',
      throwMsg);
  });
});
