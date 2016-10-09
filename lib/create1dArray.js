'use strict';

module.exports = function create1darray (m, constructFn) {
  var arr = [];
  var i = 0;

  var cFn;
  if (typeof constructFn === 'function') {
    cFn = constructFn;
  } else if (cFn === undefined || cFn === null) {
    cFn = function () {
      return 0.0;
    };
  } else {
    cFn = function () {
      return constructFn;
    };
  }

  for (i = 0; i < m; ++i) {
    arr.push(cFn());
  }
  return arr;
};
