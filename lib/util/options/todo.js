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
      data = format.splitInPairs(data, true);

      var todoIdx = logHandle.getTodoIndex(data);
      var todoConsecutive = 1;
      var todo;

      if (!!~ todoIdx) {
        todo = data[todoIdx];
        todoConsecutive = /\[TODO #(\d+)\]/.exec(todo[todo.length - 1]);
        todoConsecutive = todoConsecutive && parseInt(todoConsecutive[1], 10) + 1;
      }

      return Q.when('[TODO #' + todoConsecutive + ']: ' + msg);
    });
};
