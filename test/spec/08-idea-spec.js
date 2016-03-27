'use strict';

var assert = require('assert');
var runProcess = require('./../../lib/util/run-process').runProcess;
var path = require('path');
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var CONFIG_PATH = require('./../../package.json').CONFIG_PATH;
var splitInPairs, config;

describe('Idea option', function() {
  beforeEach(function () {
    config = config || require(path.resolve(CONFIG_PATH));
     splitInPairs = require('./../../lib/util/formats/' + config.FORMAT).splitInPairs;
  });

  afterEach(function () {
    config = undefined;
  });

  it('should log ideas', function (done) {
    runProcess('fxc', ['--idea', 'Test'])
      .then(function (output) {
        assert.equal(output, 'Logged: \'[IDEA]: Test\'\n');
        return readFile(path.resolve(config.LOG_PATH), 'utf-8');
      })
      .then(function (data) {
        data = splitInPairs(data);
        assert.equal(data[data.length - 1][1], '[IDEA]: Test');
      })
      .done(done);
  });
});
