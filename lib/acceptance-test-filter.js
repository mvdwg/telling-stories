/*jshint node:true*/

'use strict'

var fs = require('fs');
var Filter = require('broccoli-filter');

var modules = [];

function AcceptanceTestFilter(inputNode, options) {
  this.options = options;
  Filter.call(this, inputNode, this.options);
}

AcceptanceTestFilter.prototype = Object.create(Filter.prototype);
AcceptanceTestFilter.prototype.constructor = AcceptanceTestFilter;
AcceptanceTestFilter.prototype.canProcessFile = function(relativePath) {
  return /-test\.js/.test(relativePath) && /tests\/acceptance/.test(relativePath);
};

AcceptanceTestFilter.prototype.processString = function(content, relativePath) {
  var regExp = /moduleForAcceptance\(['"]([^'"]+)/;
  var moduleNameArray = regExp.exec(content);
  if (moduleNameArray) {
    var moduleName = moduleNameArray[1];
    var newModule = { name: moduleName, tests: [] };

    var testsExp = /test\(['"]([^'"]+)/g;
    var testsMatchArray;

    while ((testsMatchArray = testsExp.exec(content)) !== null) {
      newModule.tests.push(testsMatchArray[1]);
    }

    modules.push(newModule);

    fs.writeFileSync('public/acceptance.json', JSON.stringify(modules));
  }

  return content;
}

module.exports = AcceptanceTestFilter;
