/* jshint node: true */
'use strict';
var AcceptanceTestFilter = require('./lib/acceptance-test-filter');
var Funnel = require('broccoli-funnel');
var BroccoliMergeTrees  = require('broccoli-merge-trees');
var logger = require('heimdalljs-logger')('telling-stories');

var fs = require('fs');

module.exports = {
  name: 'telling-stories',

  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/telling-stories/qunit-configuration.js', { type: 'test' });
    app.import('vendor/telling-stories/player-mode.css', { type: 'test' });
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
};
