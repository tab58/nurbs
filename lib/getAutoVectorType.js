'use strict';

var glm = require('gl-matrix');

module.exports = function getAutoVectorType (P) {
  if (P === undefined || P.length === undefined) {
    throw new Error('Vector or vector length undefined.');
  }
  if (!Number.isInteger(P.length)) {
    throw new Error('Vector length is not an integer.');
  }
  if (P.length === 2) {
    return glm.vec2;
  } else if (P.length === 3) {
    return glm.vec3;
  } else if (P.length === 4) {
    return glm.vec4;
  } else {
    throw new Error('Could not determine vector type.');
  }
};
