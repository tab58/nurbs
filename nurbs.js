'use strict';

const glm = require('gl-matrix');
const getAutoVectorType = require('./lib/getAutoVectorType.js');

// Reconfigure for using 64-bit math
glm.glMatrix.ARRAY_TYPE = Float64Array;

/**
 *  @fileOverview A library for functions to create and modify NURBS curves and surfaces.
 *  The primary focus is on performance. Thus, objects must be allocated as needed.
 *
 *  The top level NURBS object is exported when the package is called with require().
 *  Each file in the ./src/ directory can be individually called with require() as well,
 *  but must be provided with an object that contains vector operation functions, such as vec.subtract()
 *  or vec.scaleAndAdd(). These must contain the same functions as the vecX object in the npm package 'gl-matrix'.
 *
 *  For convenience, the objects NURBS.vec2, NURBS.vec3, and NURBS.vec4 are automatically configured to use the
 *  vec2, vec3, and vec4 objects from from the 'gl-matrix' package, respectively. The generic functions used in the
 *  top-level NURBS library will try to guess by reading the length of the first element of the control point data,
 *  and use the vec2, vec3, and vec4 objects for those functions. This check is performed at every invocation of the
 *  generic functions, however any calls to other functions are passed the vecX object determined at the check. The
 *  generic functions are provided for ease of use, but are generally not recommended for performance reasons.
 *
 *  The algorithms are based on the pseudocode found in The NURBS Book, by Piegl and Tiller.
 */

// Make specific objects for specific vectors
module.exports.vec2 = {};
module.exports.vec3 = {};
module.exports.vec4 = {};

// Algorithm A1.1
/*
 *  Documentation in source file for proper jsDoc generation.
 */
module.exports.evaluatePowerBasis = require('./src/alg1-1.js');

// Algorithm A1.2
/*
 *  Documentation in source file for proper jsDoc generation.
 */
module.exports.getOneBernsteinFunc = require('./src/alg1-2.js');

// Algorithm A1.3
/*
 *  Documentation in source file for proper jsDoc generation.
 */
module.exports.getAllBernsteinFuncs = require('./src/alg1-3.js');

// Algorithm A1.4
const evaluateBezierCurveGeneric = require('./src/alg1-4.js');
/**
 *  Evaluate the Berzier curve at the parameter value.
 *
 *  @param {Array|vec(2,3,4)} P - the control point of the curve
 *  @param {Number} n - the degree of the Bernstein basis functions
 *  @param {Number} u - the parameter value, 0 <= u <= 1
 *  @param {vec(2,3,4)} C - the evaluated curve
 *
 *  @returns {vec(2,3,4)} - the input parameter C
 */
module.exports.evaluateBezierCurve = function (P, n, u, C) {
  var vec = getAutoVectorType(P[0]);
  return evaluateBezierCurveGeneric(P, n, u, C, vec);
};
module.exports.vec2.evaluateBezierCurve = function evaluateBezierCurve (P, n, u, C) {
  return evaluateBezierCurveGeneric(P, n, u, C, glm.vec2);
};
module.exports.vec3.evaluateBezierCurve = function evaluateBezierCurve (P, n, u, C) {
  return evaluateBezierCurveGeneric(P, n, u, C, glm.vec2);
};
module.exports.vec4.evaluateBezierCurve = function evaluateBezierCurve (P, n, u, C) {
  return evaluateBezierCurveGeneric(P, n, u, C, glm.vec2);
};

// Algorithm A2.1
/*
 *  Documentation in source file for proper jsDoc generation.
 */
module.exports.findKnotSpan = require('./src/alg2-1.js');

// Algorithm A2.2
/*
 *  Documentation in source file for proper jsDoc generation.
 */
module.exports.getBasisFunctions = require('./src/alg2-2.js');

// Algorithm A2.3
/*
 *  Documentation in source file for proper jsDoc generation.
 */
module.exports.getDerivsOfBasisFunctions = require('./src/alg2-3.js');

// Algorithm A2.4
/*
 *  Documentation in source file for proper jsDoc generation.
 */
module.exports.getOneBasisFunction = require('./src/alg2-4.js');

// Algorithm A2.5
/*
 *  Documentation in source file for proper jsDoc generation.
 */
module.exports.getDerivsOf1BasisFunction = require('./src/alg2-5.js');

// Algorithm A3.1
const getCurvePointGeneric = require('./src/alg3-1.js');
/**
 *  Computes the point on the curve at the given parameter value.
 *
 *  NOTES:
 *    1. Computes the knot span from the parameter value.
 *    2. If the optional parameter is null/undefined, the vector is created and the dimension information is calculated from the first control point.
 *
 *  @param {Number} u - the parameter value at which to evaluate the basis function
 *  @param {Number} p - the degree of the B-spline (integer)
 *  @param {Array|Number} U - the knot vector of the B-spline
 *  @param {Array|vec(2,3,4)} P - the control points
 *  @param {Array|Number} N - the B-spline basis functions of the curve
 *  @param {Array|Number} [vec(2,3,4)] - a vector to hold the point data
 *
 *  @returns {vec(2,3,4)} - the optional parameter or a vector the point at the given parameter value
 */
module.exports.getCurvePoint = function getCurvePoint (u, p, U, P, N, C) {
  var vec = getAutoVectorType(P[0]);
  return getCurvePointGeneric(u, p, U, P, N, C, vec);
};
module.exports.vec2.getCurvePoint = function getCurvePoint (u, p, U, P, N, C) {
  return getCurvePointGeneric(u, p, U, P, N, C, glm.vec2);
};
module.exports.vec3.getCurvePoint = function getCurvePoint (u, p, U, P, N, C) {
  return getCurvePointGeneric(u, p, U, P, N, C, glm.vec3);
};
module.exports.vec4.getCurvePoint = function getCurvePoint (u, p, U, P, N, C) {
  return getCurvePointGeneric(u, p, U, P, N, C, glm.vec4);
};

// Algorithm A3.2
const getCurveDerivativesGeneric = require('./src/alg3-2.js');
/**
 *  Computes the points at the parameter value on a series of derivative curves.
 *
 *  NOTES:
 *    1. Computes the full triangular table for nonzero basis functions.
 *
 *  @param {Number} u - the parameter value at which to evaluate the basis function
 *  @param {Number} p - the degree of the B-spline (integer)
 *  @param {Array|Number} U - the knot vector of the B-spline
 *  @param {Array|vec(2,3,4)} P - the control point array
 *  @param {Number} d - the number of derivatives to evaluate (integer, d in [0, Inf) but d > p is zero)
 *  @param {Array|vec(2,3,4)} C - an Array(d+1) array with vector element to hold the points of the derivative curves.
 *
 *  @returns {Array|Number} - the input parameter C
 */
module.exports.getCurveDerivatives = function getCurveDerivatives (u, p, U, P, d, C) {
  var vec = getAutoVectorType(P[0]);
  return getCurveDerivativesGeneric(u, p, U, P, d, C, vec);
};
module.exports.vec2.getCurveDerivatives = function getCurveDerivatives (u, p, U, P, d, C) {
  return getCurveDerivativesGeneric(u, p, U, P, d, C, glm.vec2);
};
module.exports.vec3.getCurveDerivatives = function getCurveDerivatives (u, p, U, P, d, C) {
  return getCurveDerivativesGeneric(u, p, U, P, d, C, glm.vec3);
};
module.exports.vec4.getCurveDerivatives = function getCurveDerivatives (u, p, U, P, d, C) {
  return getCurveDerivativesGeneric(u, p, U, P, d, C, glm.vec4);
};

// Algorithm A3.3
const getCurveDerivCtrlPointsGeneric = require('./src/alg3-3.js');
/**
 *  Computes the points for a given section (r1 to r2 inclusive) of a series of derivative curves.
 *
 *  @param {Number} p - the degree of the B-spline (integer)
 *  @param {Array|Number} U - the knot vector of the B-spline
 *  @param {Array|vec(2,3,4)} P - the control point array
 *  @param {Number} d - the number of derivatives to evaluate (integer, d <= p)
 *  @param {Number} r1 - the start of the control point region (integer)
 *  @param {Number} r2 - the end of the control point region (integer, r2 > r1)
 *  @param {Array|vec(2,3,4)} Pk - an Array[d+1][r2-r1+1] to hold the arrays of points for the derivative curves.
 *
 *  @returns {Array|vec(2,3,4)} - the input parameter Pk
 */
module.exports.getCurveDerivCtrlPoints = function getCurveDerivCtrlPoints (p, U, P, d, r1, r2, Pk) {
  var vec = getAutoVectorType(P[0]);
  return getCurveDerivCtrlPointsGeneric(p, U, P, d, r1, r2, Pk, vec);
};
module.exports.vec2.getCurveDerivCtrlPoints = function getCurveDerivCtrlPoints (p, U, P, d, r1, r2, Pk) {
  return getCurveDerivCtrlPointsGeneric(p, U, P, d, r1, r2, Pk, glm.vec2);
};
module.exports.vec3.getCurveDerivCtrlPoints = function getCurveDerivCtrlPoints (p, U, P, d, r1, r2, Pk) {
  return getCurveDerivCtrlPointsGeneric(p, U, P, d, r1, r2, Pk, glm.vec3);
};
module.exports.vec4.getCurveDerivCtrlPoints = function getCurveDerivCtrlPoints (p, U, P, d, r1, r2, Pk) {
  return getCurveDerivCtrlPointsGeneric(p, U, P, d, r1, r2, Pk, glm.vec4);
};

// Algorithm A3.4
const getCurveDerivsAtPointGeneric = require('./src/alg3-4.js');
/**
 *  Computes the derivatives for the curve at a specific parameter value.
 *
 *  NOTES:
 *      1. This calls 'getCurveDerivCtrlPoints' to evaluate the control points.
 *
 *  @param {Number} p - the degree of the B-spline (integer)
 *  @param {Array|Number} U - the knot vector of the B-spline
 *  @param {Array|vec(2,3,4)} P - the 2D control points
 *  @param {Number} u - the parameter value at which to evaluate the basis function
 *  @param {Number} d - the number of derivatives to evaluate (integer, d <= p)
 *  @param {Array|vec(2,3,4)} CK - an Array(d+1) of vec(2,3,4), the values of the derivatives at the parameter value
 */
module.exports.getCurveDerivsAtPoint = function getCurveDerivsAtPoint (p, U, P, u, d, CK) {
  var vec = getAutoVectorType(P[0]);
  return getCurveDerivsAtPointGeneric(p, U, P, u, d, CK, vec);
};
module.exports.vec2.getCurveDerivsAtPoint = function getCurveDerivsAtPoint (p, U, P, u, d, CK) {
  return getCurveDerivsAtPointGeneric(p, U, P, u, d, CK, glm.vec2);
};
module.exports.vec3.getCurveDerivsAtPoint = function getCurveDerivsAtPoint (p, U, P, u, d, CK) {
  return getCurveDerivsAtPointGeneric(p, U, P, u, d, CK, glm.vec3);
};
module.exports.vec4.getCurveDerivsAtPoint = function getCurveDerivsAtPoint (p, U, P, u, d, CK) {
  return getCurveDerivsAtPointGeneric(p, U, P, u, d, CK, glm.vec4);
};

// Algorithm A3.5
var getSurfacePointGeneric = require('./src/alg3-5.js');
/**
 *  Computes a point on a surface.
 *
 *  @param {Number|int} p - the degree of the surface in the u-direction
 *  @param {Array|Number} U - the knot vector in the u-direction
 *  @param {Number|int} q - the degree of the surface in the v-direction
 *  @param {Array|Number} V - the knot vector in the v-direction
 *  @param {Array|vec(2,3,4)} P - the control point net, with P[u][v]
 *  @param {Number} u - the u-parameter value
 *  @param {Number} v - the v-parameter value
 *
 *  @returns {vec(2,3,4)} - the point at the parameter values on the surface
 */
module.exports.getSurfacePoint = function getSurfacePoint (p, U, q, V, P, u, v, S) {
  var vec = getAutoVectorType(P[0][0]);
  return getSurfacePointGeneric(p, U, q, V, P, u, v, S, vec);
};
module.exports.vec2.getSurfacePoint = function getSurfacePoint (p, U, q, V, P, u, v, S) {
  return getSurfacePointGeneric(p, U, q, V, P, u, v, S, glm.vec2);
};
module.exports.vec3.getSurfacePoint = function getSurfacePoint (p, U, q, V, P, u, v, S) {
  return getSurfacePointGeneric(p, U, q, V, P, u, v, S, glm.vec3);
};
module.exports.vec4.getSurfacePoint = function getSurfacePoint (p, U, q, V, P, u, v, S) {
  return getSurfacePointGeneric(p, U, q, V, P, u, v, S, glm.vec4);
};

// Algorithm A3.6
const getSurfPartialDerivsGeneric = require('./src/alg3-6.js');
/**
 *  Computes the partial derivatives of the surface.
 *
 *  NOTES:
 *    1. The element SKL[i][j] is the derivative of the surface with respect to u _i_ times
 *       and with respect to v _j_ times.
 *    2. With the above definition of SKL[i][j], 0 <= i + j <= d.
 *
 *  @param {Number|int} p - the degree of the surface in the u-direction
 *  @param {Array|Number} U - the knot vector in the u-direction
 *  @param {Number|int} q - the degree of the surface in the v-direction
 *  @param {Array|Number} V - the knot vector in the v-direction
 *  @param {Array|vec(2,3,4)} P - the control points of the surface
 *  @param {Number} u - the u parameter at which the derivatives are to be evaluated
 *  @param {Number} v - the v parameter at which the derivatives are to be evaluated
 *  @param {Number|int} d - the maximum order of the derivatives
 *  @param {Array|vec(2,3,4)} SKL - the output array to hold the partial derivatives
 *
 *  @returns {Array|vec(2,3,4)} - the input parameter SKL
 */
module.exports.getSurfacePartialDerivsAtPoint = function getSurfacePartialDerivsAtPoint (p, U, q, V, P, u, v, d, SKL) {
  var vec = getAutoVectorType(P[0][0]);
  return getSurfPartialDerivsGeneric(p, U, q, V, P, u, v, d, SKL, vec);
};
module.exports.vec2.getSurfacePartialDerivsAtPoint = function getSurfacePartialDerivsAtPoint (p, U, q, V, P, u, v, d, SKL) {
  return getSurfPartialDerivsGeneric(p, U, q, V, P, u, v, d, SKL, glm.vec2);
};
module.exports.vec3.getSurfacePartialDerivsAtPoint = function getSurfacePartialDerivsAtPoint (p, U, q, V, P, u, v, d, SKL) {
  return getSurfPartialDerivsGeneric(p, U, q, V, P, u, v, d, SKL, glm.vec3);
};
module.exports.vec4.getSurfacePartialDerivsAtPoint = function getSurfacePartialDerivsAtPoint (p, U, q, V, P, u, v, d, SKL) {
  return getSurfPartialDerivsGeneric(p, U, q, V, P, u, v, d, SKL, glm.vec4);
};

// Algorithm A3.7
const getSurfDerivCtrlPtsGeneric = require('./src/alg3-7.js');
/**
 *  Computes the control points in a specific region for the partial derivatives of the surface.
 *
 *  NOTES:
 *    1. The element PKL[k][l][i][j] is (i,j)th control point of the derivative of the surface
 *       with respect to u _k_ times and with respect to v _l_ times.
 *    2. With the above definition of PKL[i][j], 0 <= k + l <= d.
 *
 *  @param {Number|int} p - the degree of the surface in the u-direction
 *  @param {Array|Number} U - the knot vector in the u-direction
 *  @param {Number|int} q - the degree of the surface in the v-direction
 *  @param {Array|Number} V - the knot vector in the v-direction
 *  @param {Array|vec(2,3,4)} P - the control points of the surface
 *  @param {Number} u - the u parameter at which the derivatives are to be evaluated
 *  @param {Number} v - the v parameter at which the derivatives are to be evaluated
 *  @param {Number|int} d - the maximum order of the derivatives
 *  @param {Number|int} r1 - the start of the u-direction control point calculation region
 *  @param {Number|int} r2 - the end of the u-direction control point calculation region
 *  @param {Number|int} s1 - the start of the v-direction control point calculation region
 *  @param {Number|int} s2 - the end of the v-direction control point calculation region
 *  @param {Array|vec(2,3,4)} PKL - the output array to hold the partial derivatives
 *
 *  @returns {Array|vec(2,3,4)} - the input parameter SKL
 */
module.exports.getSurfaceDerivCtrlPoints = function getSurfaceDerivCtrlPoints (p, U, q, V, P, u, v, d, r1, r2, s1, s2, PKL) {
  var vec = getAutoVectorType(P[0][0]);
  return getSurfDerivCtrlPtsGeneric(p, U, q, V, P, u, v, d, r1, r2, s1, s2, PKL, vec);
};
module.exports.vec2.getSurfaceDerivCtrlPoints = function getSurfaceDerivCtrlPoints (p, U, q, V, P, u, v, d, r1, r2, s1, s2, PKL) {
  return getSurfDerivCtrlPtsGeneric(p, U, q, V, P, u, v, d, r1, r2, s1, s2, PKL, glm.vec2);
};
module.exports.vec2.getSurfaceDerivCtrlPoints = function getSurfaceDerivCtrlPoints (p, U, q, V, P, u, v, d, r1, r2, s1, s2, PKL) {
  return getSurfDerivCtrlPtsGeneric(p, U, q, V, P, u, v, d, r1, r2, s1, s2, PKL, glm.vec3);
};
module.exports.vec2.getSurfaceDerivCtrlPoints = function getSurfaceDerivCtrlPoints (p, U, q, V, P, u, v, d, r1, r2, s1, s2, PKL) {
  return getSurfDerivCtrlPtsGeneric(p, U, q, V, P, u, v, d, r1, r2, s1, s2, PKL, glm.vec4);
};

// Algorithm A4.1
const getRationalCurvePointGeneric = require('./src/alg4-1.js');

/**
 *  Computes a point on a rational B-spline curve at the desired parameter value.
 *
 *  NOTES:
 *    1. Computes the knot span from the parameter value.
 *    2. When W is undefined or null, the weights default to 1.
 *
 *  @param {Number} u - the parameter value at which to evaluate the basis function
 *  @param {Number} p - the degree of the B-spline (integer)
 *  @param {Array|Number} U - the knot vector of the B-spline
 *  @param {Array|vec(2,3,4)} P - the 2D control points
 *  @param {Array|Number} W - the weights of the control points
 *  @param {vec(2,3,4)} C - the vector to hold the rational curve point
 *
 *  @returns {vec(2,3,4)} - the input parameter C
 *
 */
module.exports.getRationalCurvePoint = function getRationalCurvePoint (u, p, U, P, W, C) {
  var vec = getAutoVectorType(P[0]);
  return getRationalCurvePointGeneric(u, p, U, P, W, C, vec);
};
module.exports.vec2.getRationalCurvePoint = function getRationalCurvePoint (u, p, U, P, W, C) {
  return getRationalCurvePointGeneric(u, p, U, P, W, C, glm.vec2);
};
module.exports.vec3.getRationalCurvePoint = function getRationalCurvePoint (u, p, U, P, W, C) {
  return getRationalCurvePointGeneric(u, p, U, P, W, C, glm.vec3);
};
module.exports.vec4.getRationalCurvePoint = function getRationalCurvePoint (u, p, U, P, W, C) {
  return getRationalCurvePointGeneric(u, p, U, P, W, C, glm.vec4);
};

// Algorithm A4.2
const getRationalCurveDerivAtPointGeneric = require('./src/alg4-2.js');
/**
 *  Computes the derivatives of a point on a rational B-spline curve at the desired parameter value.
 *
 *  NOTES:
 *
 *  @param {Array|vec(2,3,4)} P - the control point array for the curve
 *
 *  @returns {} -
 *
 */
module.exports.getRationalCurveDerivAtPoint = function getRationalCurveDerivAtPoint (P) {
  var vec = getAutoVectorType(P[0]);
  return getRationalCurveDerivAtPointGeneric(P, vec);
};
module.exports.vec2.getRationalCurveDerivAtPoint = function getRationalCurveDerivAtPoint (P) {
  return getRationalCurveDerivAtPointGeneric(P, glm.vec2);
};
module.exports.vec3.getRationalCurveDerivAtPoint = function getRationalCurveDerivAtPoint (P) {
  return getRationalCurveDerivAtPointGeneric(P, glm.vec3);
};
module.exports.vec4.getRationalCurveDerivAtPoint = function getRationalCurveDerivAtPoint (P) {
  return getRationalCurveDerivAtPointGeneric(P, glm.vec4);
};
