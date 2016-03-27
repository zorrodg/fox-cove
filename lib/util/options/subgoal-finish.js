'use strict';

var Q = require('q');
var fs = require('fs');
var resolve = require('path').resolve;
var readFile = Q.denodeify(fs.readFile);
var writeFile = Q.denodeify(fs.writeFile);
var logHandle = require('./../log-handle');
var format;

module.exports = function (id, config) {
  format = require('./../formats/' + config.FORMAT);

  return readFile(resolve(config.LOG_PATH), 'utf-8')
    .then(function (data) {
      data = format.splitInPairs(data, true);

      var goal, subgoalIdx;
      var goalIdx = logHandle.getGoalIndex(data);

      if (!~ goalIdx) {
        console.log('You haven\'t set a goal yet. Please set a goal first with -G option');
        process.exit(1);
      }

      goal = data[goalIdx];
      subgoalIdx = logHandle.getSubGoalIndex(goal, id);

      if (!~ subgoalIdx) {
        console.log('Subgoal ID not found. Check your goals with `fxc view -G` command');
        process.exit(1);
      }

      data[goalIdx][subgoalIdx] = goal[subgoalIdx]
        .replace(/(\[#\d+\]: )(.*)/, '$1-- DONE -- $2');

      return writeFile(resolve(config.LOG_PATH), format.joinPairs(data));
    })
    .then(function () {
      console.log('Subgoal #' + id + ' marked as done');
      process.exit();
    });
};
