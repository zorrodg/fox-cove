'use strict';

var moment = require('moment');

module.exports = function (str) {
  return moment().format() + '\r\n  ' +
    str + '\r\n';
};