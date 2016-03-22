'use strict';

var assert = require('assert');
var runProcess = require('./../util/run-process');
var Q = require('q');
var path = require('path');
var readFile = Q.denodeify(require('fs').readFile);

describe('Entry command', function () {
  it('shoud output error message when no msg is set', function (done) {
    runProcess('fxc')
      .then(function (output) {
        assert.equal(output, 'No message provided. Please provide a message to log.\n');
      })
      .done(done);
  });

  it('should log a message', function (done) {
    runProcess('fxc', ['This is a new message'])
      .then(function (output) {
        assert(new RegExp('Logged: \'This is a new message\'\n').test(output));
      })
      .done(done);
  });
});

describe('Coffee / Work options', function() {
  it('should log ---- COFFEE BREAK ----', function (done) {
    runProcess('fxc', ['--coffee'])
      .then(function (output) {
        assert.equal(output, 'Logged: \'---- COFFEE BREAK ----\'\n');
        return readFile(path.resolve('./logs/CURRENT'), 'utf-8');
      })
      .then(function (data) {
        data = data.trim().split('\r\n');
        assert.equal(data[data.length - 1], '  ---- COFFEE BREAK ----');
      })
      .done(done); 
  });
});