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
    this.isGeneratingSite = !!process.env['TELLING_STORIES'];

    this._super.included.apply(this, arguments);

    app.import('vendor/telling-stories/qunit-configuration.js', { type: 'test', prepend: true });
    app.import('vendor/telling-stories/player-mode.css', { type: 'test' });
  },

  postBuild: function(result) {
    if (!this.isGeneratingSite) {
      return;
    }

    var dir = result.directory;
    var fs = require('fs');
    var path = require('path');

    fs.unlinkSync(path.resolve(dir, 'index.html'));
    fs.renameSync(path.resolve(dir, 'tests/index.html'), path.resolve(dir, 'runner.html'));
    fs.renameSync(path.resolve(dir, 'telling-stories/viewer.html'), path.resolve(dir, 'index.html'));
    fs.renameSync(path.resolve(dir, 'telling-stories/embed.html'), path.resolve(dir, 'embed.html'));
  },

  treeFor: function() {
    if (!this.shouldIncludeFiles()) {
      return;
    }

    return this._super.treeFor.apply(this, arguments);
  },

  treeForPublic: function() {
    if (!this.isGeneratingSite) {
      return;
    }

    var publicTree = this._super.treeForPublic.apply(this, arguments);

    var CreateListOfTests = require('./lib/create-list-of-tests');
    var testListTree = new CreateListOfTests('tests');

    var BroccoliMergeTrees = require('broccoli-merge-trees');

    return new BroccoliMergeTrees([publicTree, testListTree]);
  },

  isDevelopingAddon: function() {
    return true;
  },

  shouldIncludeFiles: function() {
    return !!this.app.tests;
  },

  includedCommands: function() {
    return require('./lib/commands');
  }
};
