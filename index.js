/* jshint node: true */
'use strict';
var EngineAddon = require('ember-engines/lib/engine-addon');
var AcceptanceTestFilter = require('./lib/acceptance-test-filter');

var fs = require('fs');

module.exports = EngineAddon.extend({
  name: 'telling-stories',

  included: function(app) {
    this._super.included.apply(this, arguments);
  },

  preprocessTree: function(type, tree) {
    if (type === "test") {
      return new AcceptanceTestFilter(tree);
    }
    return tree;
  }
});
