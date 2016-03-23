'use strict';

var spawn = require('child_process').spawn;
var Q = require('q');
var concat = require('concat-stream');

function runProcess(command, args) {
  args  = args || [];
  var proc = spawn(command, args);
  var deferred = Q.defer();
  
  proc.stdout.pipe(concat(function (output) {
    deferred.resolve(output.toString('utf-8'));
  }));

  return deferred.promise;
}

function processStream(command, args) {
  args  = args || [];

  var proc = spawn(command, args);
  var deferred = Q.defer();

  proc.stdout.on('data', function (data) {
    console.log(data.toString('utf-8'));
  });

  proc.stderr.on('data', function (data) {
    console.log('Error: ' + data.toString('utf-8'));
  });

  proc.on('close', function (code) {
    deferred.resolve();
  });

  return deferred.promise;
}

module.exports = {
  runProcess: runProcess,
  processStream: processStream,
};