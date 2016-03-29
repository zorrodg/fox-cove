'use strict';

var moment = require('moment');
var chalk = require('chalk');
var DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

module.exports = {
  format: function (str) {
    return moment().format() + '\n  ' +
      str + '\n';
  },

  output: function (arr, config) {
    arr = config.SORT === "ASC" ? arr.reverse() : arr;

    return arr.map(function(i) {
      i[0] = chalk.dim(moment(i[0]).format(config.TIME_FORMAT));

      return i.join('\n');
    }).join('\r\n');
  },

  splitInPairs: function (arr, preserveSpacing) {
    arr = arr || '';
    return arr.trim().replace(/\r/g, '').split('\n').reduce(function (arr, next, idx) {
      next = preserveSpacing ? next : next.trim();

      if (DATE_REGEX.test(next)) {
        arr.push([next]);
        return arr;
      }

      if (arr[arr.length - 1]) {
        arr[arr.length - 1].push(next);
      }

      return arr;
    }, []);
  },

  joinPairs: function (arr) {
    // TODO: Handle cases when spaces have been trimmed
    return arr.map(function (item) {
      return item.join('\n');
    }).join('\n') + '\n';
  },
};
