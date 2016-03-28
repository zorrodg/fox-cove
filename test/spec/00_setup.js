'use strict';

var Q = require('q');
var fs = require('fs');
var resolve = require('path').resolve;
var stat = Q.denodeify(fs.stat);
var readFile = Q.denodeify(fs.readFile);
var writeFile = Q.denodeify(fs.writeFile);
var unlink = Q.denodeify(fs.unlink);

var tmpConfig;
var TEST_CONFIG = {
  "LOG_PATH": "./test-logs/TEST",
  "_TESTING": true,
  "FORMAT": "default"
};

before(function (done) {
  console.log('Setup');
  stat(resolve('./config.json'))
    .then(function (stat) {
      if (stat.isFile()) {
        return readFile(resolve('./config.json'));
      }
    })
    .catch(function (err) {
      return Q.when(null);
    })
    .then(function (fileContents) {
      if (fileContents) {
        tmpConfig = fileContents.toString('utf8');
        console.log('Preserving config:', tmpConfig);
      }
      return writeFile(resolve('./config.json'), JSON.stringify(TEST_CONFIG));
    })
    .done(done);
});

after(function (done) {
  console.log('Teardown');
  var promise;

  if (tmpConfig) {
    promise = writeFile(resolve('./config.json'), tmpConfig);
    console.log('Restoring config:', tmpConfig);
  } else {
    promise = unlink(resolve('./config.json'));
  }

  promise.done(done);
});
