'use strict';

var spawn = require('child_process').spawn;
var Q = require('q');
var concat = require('concat-stream');

function runProcess(command, args, mock) {
  args  = args || [];
  var proc = mock ? null : spawn(command, args);
  var deferred = Q.defer();

  if (proc) {
    proc.stdout.pipe(concat(function (output) {
      deferred.resolve(output.toString('utf-8'));
    }));
  } else {
    // Mocked
    deferred.resolve(command + ' ' + args.join(' '));
  }

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
