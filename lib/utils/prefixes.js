'use strict';

var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);

var PREFIXES = {
  shell: function (str) {
    return Q.when('[$]: ' + str);
  },
  goal: function (str) {
    return Q.when('[GOAL]: ' + str);
  },
  subgoal: function (str) {
    // TODO: Sub goals
    return Q.when();
  },
  work: function () {
    return Q.when('---- WORK START ----');
  },
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

module.exports = function (prefix, msg) {
  if (PREFIXES.hasOwnProperty(prefix)) {
    return PREFIXES[prefix](msg);
  }
};