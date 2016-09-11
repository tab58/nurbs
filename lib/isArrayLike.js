'use strict';

module.exports = function isArrayLike (obj) {
  return Array.isArray(obj) ||
    obj instanceof Float32Array ||
    obj instanceof Float64Array ||
    obj instanceof Int8Array ||
    obj instanceof Uint8Array ||
    obj instanceof Uint8ClampedArray ||
    obj instanceof Int16Array ||
    obj instanceof Uint16Array ||
    obj instanceof Int32Array ||
    obj instanceof Uint32Array;
};
