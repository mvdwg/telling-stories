/*jshint node:true*/

'use strict'

var fs = require('fs');
var TreeTraverser = require('broccoli-tree-traverser')
var Writer = require('broccoli-writer');
var logger = require('heimdalljs-logger')('telling-stories');
var path = require('path');
var util = require('util');
var RSVP = require('rsvp');
var crypto = require('crypto');

function goodEnoughId(module, test) {
  return crypto
    .createHash('md5')
    .update(module)
    .update(test)
    .digest('base64').replace(/\\\+|=/g,''); // remove \ + = chars
}

var outputFile = 'telling-stories.json';

function AcceptanceTestFilter(inputTree) {
  this.inputTree = inputTree;
  this.walker = new TreeTraverser(inputTree, this);
}

util.inherits(AcceptanceTestFilter, Writer);

AcceptanceTestFilter.prototype.visit = function(filePath) {
  var self = this;

  return new RSVP.Promise(function(resolve, reject) {
    if (self.canProcessFile(filePath)) {
      fs.readFile(filePath, function(err, data) {
        if (err) {
          reject(err);
        } else {
          self.processString(data, filePath);
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

AcceptanceTestFilter.prototype.canProcessFile = function(relativePath) {
  logger.debug('canProcessFile: ' + relativePath);
  return /-test\.js/.test(relativePath);
};


AcceptanceTestFilter.prototype.processString = function(content, relativePath) {
  // See https://regex101.com/r/cM4lB4/3
  var MODULE_TEXT_REGEXP = /moduleForAcceptance\((['"`])((?:.|\\')+)\1\)/;
  var TEST_TEXT_REGEXP = /test\((['"`])((?:.|\\')+)\1.+\)/g

  var matches = MODULE_TEXT_REGEXP.exec(content);
  var record;
  var tests;

  if (matches) {
    record = {
      module: matches[2],
      tests: []
    };

    while ((matches = TEST_TEXT_REGEXP.exec(content)) !== null) {
      record.tests.push({
        id: goodEnoughId(record.module, matches[2]),
        name: matches[2]
      });
    }

    this.modules.push(record);
  }
};

AcceptanceTestFilter.prototype.write = function(readTree, destDir) {
  fs.mkdirSync(path.join(destDir, 'tests'));
  var self = this;
  this.modules = [];

  return readTree(this.walker)
    .then(function () {
      return new RSVP.Promise(function (resolve, reject) {
        fs.writeFile(path.join(destDir, outputFile), JSON.stringify(self.modules), function (err) {
          if (err) {
            reject(err);
          } else {
            logger.debug(path.join(destDir, outputFile));
            logger.debug(fs.readFileSync(path.join(destDir, outputFile)));
            resolve();
          }
        });
      });
    });
};

module.exports = AcceptanceTestFilter;
