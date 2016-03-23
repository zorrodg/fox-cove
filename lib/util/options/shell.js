'use strict';

var Q = require('q');
var p = require('./../run-process');
var exec = require('child_process').execSync;

module.exports = function (str) {
  var c;
  if (str) {
    c = str.split(' ');
    return p.processStream(c.shift(), c)
      .then(function () {
        return Q.when('[$]: ' + str);
      });
  }

  return p.runProcess('fc', ['-ln', '-1'])
    .then(function (output) {
      return Q.when('[$]: ' + output);
    });
};