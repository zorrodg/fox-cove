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

      var todoIdx = logHandle.getTodoIndexById(data, id);

      if (!~ todoIdx) {
        console.log('TODO not found. To list all TODOS, use `fxc view -t` command');
        process.exit(1);
      }
      data[todoIdx][1] = data[todoIdx][1]
        .replace(/(\[TODO #\d+\]: )(.*)/, '$1-- DONE -- $2');

      return writeFile(resolve(config.LOG_PATH), format.joinPairs(data));
    })
    .then(function () {
      console.log('TODO #' + id + ' marked as done');
      process.exit();
    });
};
