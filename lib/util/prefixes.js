'use strict';

var Q = require('q');

var PREFIXES = {
  goal: function (str) {
    return Q.when('[GOAL]: ' + str);
  },
  subgoal: require('./options/subgoal'),
  subgoalFinish: require('./options/subgoalFinish'),
  shell: require('./options/shell'),
  work: require('./options/work'),
  coffee: function () {
    return Q.when('---- COFFEE BREAK ----');
  },
  search: function (str) {
    return Q.when('[SEARCH]: ' + str);
  },
  todo: function (str) {
    // TODO: Add todo consecutive to this log
    return Q.when('[TODO #]: ' + str);
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
