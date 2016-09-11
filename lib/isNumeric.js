'use strict';

module.exports = function isNumeric (obj) {
  return !Array.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
};
