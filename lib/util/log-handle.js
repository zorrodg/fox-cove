'use strict';

var DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

module.exports = {
  splitInPairs: function (arr, preserveSpacing) {
    arr = arr || '';
    return arr.trim().replace(/\r/g, '').split('\n').reduce(function (arr, next, idx) {
      next = preserveSpacing ? next : next.trim();

      if (DATE_REGEX.test(next)) {
        arr.push([next]);
        return arr;
      }

      arr[arr.length - 1].push(next);
      return arr;
    }, []);
  },

  joinPairs: function (arr) {
    // TODO: Handle cases when spaces have been trimmed
    return arr.map(function (item) {
      return item.join('\n');
    }).join('\n');
  },

  getGoalIndex: function (data) {
    return data
      .reduce(function (i, next, idx) {
        return /\[GOAL\]:/.test(next[1]) ? idx : i;
      }, -1);
  },

  getSubGoalIndex: function (data, id) {
    return data
        .reduce(function (i, next, idx) {
          return new RegExp('\\[#' + id + '\\]: (?!-- DONE --)').test(next) ? idx : i;
        }, -1);
  }
};
