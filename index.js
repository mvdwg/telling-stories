/* jshint node: true */
'use strict';
var EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
  name: 'telling-stories',

  included(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/qunit-option.js', { type: 'test' });
  },

  isDevelopingAddon: function() {
    return true;
  }
});
