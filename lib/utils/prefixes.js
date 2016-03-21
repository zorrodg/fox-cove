'use strict';

module.exports = {
  command: function (str) {
    return '[$]: ' + str;
  },
  goal: function (str) {
    return '[GOAL]: ' + str;
  },
  subgoal: function (str) {
    // TODO: Sub goals
  },
  coffee: function () {
    return '---- COFFEE BREAK ----';
  },
  search: function (str) {
    return '[SEARCH]: ' + str;
  },
  todo: function (str) {
    // TODO: Add todo consecutive to this log
    return '[TODO #]: ' + str;
  },
  idea: function (str) {
    return '[IDEA]: ' + str;
  }
};