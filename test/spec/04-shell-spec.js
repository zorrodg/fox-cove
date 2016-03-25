'use strict';

var assert = require('assert');
var runProcess = require('./../../lib/util/run-process').runProcess;
var path = require('path');
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);

describe('Shell option', function () {
  it('should log last used command', function (done) {

    // This can't be tested in the main process.
    // This workaround is fragile as hell
    runProcess('fxc', ['--shell'])
      .then(function (output) {
        assert.equal(output, 'Logged: \'[$]: npm test\'\n');
      })
      .done(done);
  });

  it('Should log and execute given command', function(done) {
    runProcess('fxc', ['-c', 'whoami'])
      .then(function (output) {
        output = output.split('\n\n');
        assert.equal(output[0], process.env.USER);
        assert.equal(output[1],  'Logged: \'[$]: whoami\'\n');
      })
      .done(done);
  });
});
