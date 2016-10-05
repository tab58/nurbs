'use strict';

var findKnotSpan = require('./alg2-1.js');
var getBasisFunctions = require('./alg2-2.js');

var getSurfacePointGeneric = function getSurfacePointGeneric (p, U, q, V, P, u, v, S, vec) {
  var uspan = findKnotSpan(p, u, U);
  var vspan = findKnotSpan(q, v, V);
  var i = 0;
  var Nu = [];
  var Nv = [];
  for (i = 0; i <= p; ++i) {
    Nu.push(0.0);
  }
  for (i = 0; i <= q; ++i) {
    Nv.push(0.0);
  }
  getBasisFunctions(u, p, U, Nu);
  getBasisFunctions(v, q, V, Nv);
  var uind = uspan - p;

  var Sv = (S ? vec.set(S, 0.0, 0.0, 0.0, 0.0) : vec.create());
  var k = 0;
  var l = 0;
  var temp = vec.create();
  var vind = 0;
  for (l = 0; l <= q; ++l) {
    vec.set(temp, 0.0, 0.0, 0.0, 0.0);
    vind = vspan - q + l;
    for (k = 0; k <= p; ++k) {
      vec.scaleAndAdd(temp, temp, P[uind + k][vind], Nu[k]);
    }
    vec.scaleAndAdd(Sv, Sv, temp, Nv[l]);
  }
  return Sv;
};

module.exports = getSurfacePointGeneric;
