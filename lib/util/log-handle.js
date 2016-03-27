'use strict';

var DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function getIndexInDataPairs(regex) {
  return function (data) {
    return data
      .reduce(function (i, next, idx) {
        return regex.test(next[1]) ? idx : i;
      }, -1);
  };
}

module.exports = {
  getGoalIndex: getIndexInDataPairs(/\[GOAL\]:/),
  getTodoIndex: getIndexInDataPairs(/\[TODO #\d+\]:/),
  getTodoIndexById: function (data, id) {
    var regex = new RegExp('\\[TODO #' + id + '\\]: (?!-- DONE --)');
    return getIndexInDataPairs(regex)(data);
  },

  getSubGoalIndex: function (data, id) {
    return data
        .reduce(function (i, next, idx) {
          return new RegExp('\\[#' + id + '\\]: (?!-- DONE --)').test(next) ? idx : i;
        }, -1);
  }
};
