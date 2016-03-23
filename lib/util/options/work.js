'use strict';

var Q = require('q');
var path = require('path');
var readFile = Q.denodeify(require('fs').readFile);
var logHandle = require('./../log-handle');

module.exports = function () {
  return readFile(path.resolve('./logs/CURRENT'), 'utf-8')
    .then(function (data) {
      data = logHandle.splitInPairs(data)
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