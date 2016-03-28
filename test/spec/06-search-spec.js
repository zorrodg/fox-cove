'use strict';

var assert = require('assert');
var runProcess = require('./../../lib/util/run-process').runProcess;
var Q = require('q');
var platform = require('os').platform;
var readFile = Q.denodeify(require('fs').readFile);

// TODO: This might fail in some environments. Do extensive testing.
var OS_COMMAND = {
  win32: 'start',
  darwin: 'open',
  linux: 'xdg-open'
};

describe('Search option', function () {
  it('should log a search', function (done) {
    runProcess('fxc', ['-s', 'test'])
      .then(function (output) {
        assert.equal(output, 'Logged: \'' + OS_COMMAND[platform()] + ' https://www.google.com.co/search?q=test\'\n');
      })
      .done(done);
  });

  it('should log a search in another engine', function (done) {
    runProcess('fxc', ['config', '--set', 'SEARCH_ENGINE=bing'])
      .then(function() {
        return runProcess('fxc', ['-s', 'test']);
      })
      .then(function (output) {
        assert.equal(output, 'Logged: \'' + OS_COMMAND[platform()] + ' http://www.bing.com/search?q=test\'\n');
      })
      .done(done);
  });

  it('should log a search in custom engine', function (done) {
    runProcess('fxc', ['config', '--set', 'SEARCH_ENGINE=http://mysearchengine.com?search='])
      .then(function() {
        return runProcess('fxc', ['-s', 'test']);
      })
      .then(function (output) {
        assert.equal(output, 'Logged: \'' + OS_COMMAND[platform()] + ' http://mysearchengine.com?search=test\'\n');
      })
      .done(done);
  });

  it('should log a multi word search', function (done) {
    runProcess('fxc', ['-s', 'multi', 'word', 'test'])
      .then(function (output) {
        assert.equal(output, 'Logged: \'' + OS_COMMAND[platform()] + ' http://mysearchengine.com?search=multi+word+test\'\n');
      })
      .done(done);
  });
});
