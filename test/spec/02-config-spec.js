'use strict';

var assert = require('assert');
var runProcess = require('./../../lib/util/run-process').runProcess;
var resolve = require('path').resolve;
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);

describe('Config file', function () {
  it('should store values to config file', function (done) {
    runProcess('fxc', ['config', '--set', 'hello=world'])
      .then(function (output) {
        assert.equal(output, 'Property "hello" set to "world"\n');
        return readFile(resolve('./config.json'));
      })
      .then(function (file) {
        file = JSON.parse(file.toString('utf8'));
        assert.equal(file.hello, 'world');
      })
      .done(done);
  });

  it('should read config vars from config file', function (done) {
    runProcess('fxc', ['config', '--get', 'hello'])
      .then(function (output) {
        assert.equal(output, 'world\n');
      })
      .done(done);
  });

  it('should remove values from config file', function (done) {
    runProcess('fxc', ['config', '--set', 'hello'])
      .then(function (output) {
        assert.equal(output, 'Property "hello" removed\n');
        return readFile(resolve('./config.json'));
      })
      .then(function (file) {
        file = JSON.parse(file.toString('utf8'));
        assert.equal(file.hasOwnProperty('hello'), false);
      })
      .done(done);
  });
});
