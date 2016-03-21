'use strict';

var spawn = require('child_process').spawn;
var Q = require('q');
var concat = require('concat-stream');

module.exports = function runProcess(command, args) {
  args  = args || [];

  var proc = spawn(command, args);
  var deferred = Q.defer();

  proc.stdout.pipe(concat(function (output) {
    deferred.resolve(output.toString('utf-8'));
  }));

  return deferred.promise;
};