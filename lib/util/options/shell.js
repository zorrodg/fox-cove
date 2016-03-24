'use strict';

var Q = require('q');
var p = require('./../run-process');
var readFile = Q.denodeify(require('fs').readFile);
var SHELLS = require('./../../../package.json').defaults.SHELL_HISTORY_LOCATIONS;
var binary = Object.keys(require('./../../../package.json').bin)[0];

module.exports = function (str) {
  var c, ex;

  if (str) {
    c = str.split(' ');
    return p.processStream(c.shift(), c)
      .then(function () {
        return Q.when('[$]: ' + str);
      });
  }

  if (process.env.SHELL && process.env.HOME) {
    ex = /\/bin\/(\w+)$/.exec(process.env.SHELL);
    if (ex && ex[1] && SHELLS.hasOwnProperty(ex[1])) {
      return readFile(process.env.HOME + SHELLS[ex[1]])
        .then(function (output) {
          var results = output
            .toString('utf8')
            .split('\n');
          var last = results.pop();

          last = last ? last : results.pop();
          last = (binary && new RegExp(binary).test(last)) ? results.pop() : last;

          return Q.when('[$]: ' + last.trim().replace(/^: \d+:\d;/, ""));
        });
    }
  }

  return Q.reject('Cannot log last command.');
};