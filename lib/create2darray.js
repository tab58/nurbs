'use strict';

module.exports = function create2darray (m, n, constructFn) {
  var arr = [];
  var i = 0;
  var j = 0;

  var cFn;
  if (typeof constructFn === 'function') {
    cFn = constructFn;
  } else if (cFn === undefined) {
    cFn = function () {
      return 0.0;
    };
  } else {
    cFn = function () {
      return constructFn;
    };
  }

  var tmp;
  for (i = 0; i < m; ++i) {
    tmp = [];
    for (j = 0; j < n; ++j) {
      tmp.push(cFn());
    }
    arr.push(tmp);
  }
  return arr;
};
