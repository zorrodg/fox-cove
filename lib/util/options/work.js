'use strict';

var Q = require('q');
var path = require('path');
var readFile = Q.denodeify(require('fs').readFile);
var splitInPairs = require('./../log-handle').splitInPairs;

module.exports = function (msg, config) {
  return readFile(path.resolve(config.LOG_PATH), 'utf-8')
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
