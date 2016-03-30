'use strict';

var moment = require('moment');
var chalk = require('chalk');
var DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

module.exports = {
  format: function (str, config) {
    return moment().format() +
      config.INPUT.NEW_LINE_CHAR +
      config.INPUT.TAB_CHAR +
      str +
      config.INPUT.NEW_LINE_CHAR;
  },

  output: function (arr, config) {
    arr = config.SORT === "ASC" ? arr.reverse() : arr;

    return arr.map(function(i) {
      i[0] = chalk.dim.white(moment(i[0]).format(config.TIME_FORMAT));

      // TODO: Fix here the multi line goals / subgoals
      return i.join(chalk.dim.white(config.OUTPUT.JOIN_CHAR));
    }).join(config.OUTPUT.NEW_LINE_CHAR);
  },

  splitInPairs: function (arr, preserveSpacing, config) {
    arr = arr || '';
    return arr.trim().replace(/\r/g, '').split(config.INPUT.NEW_LINE_CHAR).reduce(function (arr, next, idx) {
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

  joinPairs: function (arr, config) {
    // TODO: Handle cases when spaces have been trimmed
    return arr.map(function (item) {
      return item.join(config.INPUT.NEW_LINE_CHAR);
    }).join(config.INPUT.NEW_LINE_CHAR) + config.INPUT.NEW_LINE_CHAR;
  },
};
