/* jshint node: true */
'use strict';

module.exports = {
  name: 'telling-stories',

  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/telling-stories/qunit-configuration.js', { type: 'test' });
    app.import('vendor/telling-stories/player-mode.css', { type: 'test' });
  },

  treeFor: function(type) {
    var AcceptanceTestFilter = require('./lib/acceptance-test-filter');

    return new AcceptanceTestFilter('./tests/acceptance');
  },

  isDevelopingAddon: function() {
    return true;
  }
};
