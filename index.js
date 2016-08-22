/* jshint node: true */
'use strict';
var EngineAddon = require('ember-engines/lib/engine-addon');
var AcceptanceTestFilter = require('./lib/acceptance-test-filter');
var Funnel = require('broccoli-funnel');
var BroccoliMergeTrees  = require('broccoli-merge-trees');
var logger = require('heimdalljs-logger')('telling-stories');

var fs = require('fs');

module.exports = EngineAddon.extend({
  name: 'telling-stories',

  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/qunit-option.js', { type: 'test' });
    app.import('vendor/style.css');
  },

  treeFor: function(type) {
    var tree = this._super.treeFor.apply(this, arguments);

    if (type === 'public') {
      if (tree) {
        return new BroccoliMergeTrees([
          tree,
          new AcceptanceTestFilter('./tests/acceptance')
        ]);
      } else {
        return new AcceptanceTestFilter('./tests/acceptance');
      }
    }

    return tree;
  },

  isDevelopingAddon: function() {
    return true;
  }
});
