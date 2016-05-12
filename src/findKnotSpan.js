'use strict';

module.exports = function findKnotSpan (p, u, U) {
  var n = U.length - p - 1;
  if (u === U[n + 1]) {
    return n;
  }
  var lo = p;
  var hi = n + 1;
  var mid = Math.floor((lo + hi) / 2);
  while (u < U[mid] || u >= U[mid + 1]) {
    if (u < U[mid]) {
      hi = mid;
    } else {
      lo = mid;
    }
    mid = Math.floor((lo + hi) / 2);
  }
  return mid;
};
