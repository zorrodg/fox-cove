'use strict';

var Q = require('q');
var fs = require('fs');
var resolve = require('path').resolve;
var readFile = Q.denodeify(fs.readFile);
var writeFile = Q.denodeify(fs.writeFile);
var logHandle = require('./../log-handle');
var format;

module.exports = function (msg, config) {
  format = require('./../formats/' + config.FORMAT);

  return readFile(resolve(config.LOG_PATH), 'utf-8')
    .then(function (data) {
      data = format.splitInPairs(data, true, config);

      var subGoalNum = 1;
      var goal, lastSubGoalNum;
      var goalIdx = logHandle.getGoalIndex(data);

      if (!~ goalIdx) {
        console.log('You haven\'t set a goal yet. Please set a goal first with -G option');
        process.exit(1);
      }

      goal = data[goalIdx];
      lastSubGoalNum = /\[#(\d+)\]/.exec(goal[goal.length - 1]);

      if (lastSubGoalNum) {
        subGoalNum = parseInt(lastSubGoalNum[1], 10) + 1;
      }

      data[goalIdx].push(config.INPUT.TAB_CHAR + config.INPUT.TAB_CHAR + '[#' + subGoalNum + ']: ' + msg);

      return writeFile(resolve(config.LOG_PATH), format.joinPairs(data, config));
    })
    .then(function () {
      console.log('Logged subgoal: \'' + msg + '\'');
      process.exit();
    });
};
