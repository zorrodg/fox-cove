'use strict';

var Q = require('q');
var resolve = require('path').resolve;
var fs = require('fs');
var readFile = Q.denodeify(fs.readFile);
var stat = Q.denodeify(fs.stat);
var splitInPairs;

module.exports = function (msg, config) {
  splitInPairs = require('./../formats/' + config.FORMAT).splitInPairs;

  return stat(resolve(config.LOG_PATH))
    .then(function (stat) {
      if (stat.isFile()) {
        return readFile(resolve(config.LOG_PATH), 'utf-8');
      }
    })
    .catch(function () {
      return Q.when('');
    })
    .then(function (data) {
      data = splitInPairs(data)
        .filter(function (item) {
          return /^---- WORK [A-Z]{4,5} ----$/.test(item[1]);
        }).map(function (item) {
          return item[1];
        });

      if (!data.length) {
        return Q.when('---- WORK START ----');
      }

      data = /^---- WORK ([A-Z]{4,5}) ----$/.exec(data[data.length - 1]);
      data = '---- WORK ' +
        (data[1] === 'START' ? 'STOP' : 'START') +
        ' ----';

      return Q.when(data);
    });
};
