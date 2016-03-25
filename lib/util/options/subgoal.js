'use strict';

var Q = require('q');
var fs = require('fs');
var resolve = require('path').resolve;
var readFile = Q.denodeify(fs.readFile);
var writeFile = Q.denodeify(fs.writeFile);
var logHandle = require('./../log-handle');

module.exports = function (msg, config) {
  return readFile(resolve(config.LOG_PATH), 'utf-8')
    .then(function (data) {
      data = logHandle.splitInPairs(data, true);

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

      data[goalIdx].push('    [#' + subGoalNum + ']: ' + msg + '\n');

      return writeFile(resolve(config.LOG_PATH), logHandle.joinPairs(data));
    })
    .then(function () {
      console.log('Logged subgoal: \'' + msg + '\'');
      process.exit();
    });
};
