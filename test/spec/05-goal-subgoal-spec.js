'use strict';

var assert = require('assert');
var runProcess = require('./../../lib/util/run-process').runProcess;
var path = require('path');
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var splitInPairs = require('./../../lib/util/log-handle').splitInPairs;

describe('Goal / Subgoal option', function () {
  it('should log a goal', function (done) {
    runProcess('fxc', ['--goal', 'Test goal'])
      .then(function (output) {
        assert.equal(output, 'Logged: \'[GOAL]: Test goal\'\n');
        return readFile(path.resolve('./logs/TEST'), 'utf-8');
      })
      .then(function (data) {
        data = splitInPairs(data);
        assert.equal(data[data.length - 1][1], '[GOAL]: Test goal');
      })
      .done(done);
  });
});
