'use strict';

var Q = require('q');

var PREFIXES = {
  subgoal: require('./options/subgoal'),
  subgoalFinish: require('./options/subgoal-finish'),
  shell: require('./options/shell'),
  work: require('./options/work'),
  search: require('./options/search'),
  todo: require('./options/todo'),
  doneTodo: require('./options/done-todo'),
  goal: function (str) {
    return Q.when('[GOAL]: ' + str);
  },
  coffee: function () {
    return Q.when('---- COFFEE BREAK ----');
  },

  idea: function (str) {
    return Q.when('[IDEA]: ' + str);
  },
  default: function(str) {
    return Q.when(str);
  }
};

module.exports = function (prefix, msg, config) {
  if (PREFIXES.hasOwnProperty(prefix)) {
    return PREFIXES[prefix](msg, config);
  }
};
