var Plugin = require('broccoli-plugin');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

module.exports = CreateListOfTests;

CreateListOfTests.prototype = Object.create(Plugin.prototype);
CreateListOfTests.prototype.constructor = CreateListOfTests;
function CreateListOfTests(inputNode, options) {
  options = options || {};
  Plugin.call(this, [inputNode], {
    annotation: options.annotation
  });
  this.options = options;
}

CreateListOfTests.prototype.build = function() {
  var extractMetadata = require('./extract-metadata');
  var inputPath = this.inputPaths[0];

  var records = glob.sync('**/*-test.js', { cwd: inputPath })
    .map(function(fileName) {
      return path.join(inputPath, fileName);
    })
    .map(function(file) {
      return extractMetadata(fs.readFileSync(file));
    })
    .filter(function(entry) {
      return !!entry;
    });

  fs.writeFileSync(path.join(this.outputPath, 'telling-stories.json'), JSON.stringify({ features: records }));
};
