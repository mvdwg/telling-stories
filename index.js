/* jshint node: true */
'use strict';

module.exports = {
  name: 'telling-stories',

  included: function(app) {
    if (!this.shouldIncludeFiles()) {
      return;
    }

    this._super.included.apply(this, arguments);

    app.import('vendor/telling-stories/qunit-configuration.js', { type: 'test' });
    app.import('vendor/telling-stories/player-mode.css', { type: 'test' });
  },

  treeFor: function() {
    if (!this.shouldIncludeFiles()) {
      return;
    }

    return this._super.treeFor.apply(this, arguments);
  },

  isDevelopingAddon: function() {
    return true;
  },

  shouldIncludeFiles: function() {
    return !!this.app.tests;
  }
};
