/* jshint node: true */
'use strict';

module.exports = {
  name: 'telling-stories',

  included: function(app) {
    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.app = app;

    if (!this.shouldIncludeFiles()) {
      return;
    }

    this._super.included.apply(this, arguments);

    app.import('vendor/telling-stories/qunit-configuration.js', { type: 'test', prepend: true });
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
