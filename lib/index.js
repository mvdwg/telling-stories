/*jshint node:true*/
module.exports = {
  name: 'telling-stories-parser',

  included: function(app, addon) {
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.app = app;

    this._super.included.apply(this, arguments);
  },

  isDevelopingAddon: function() {
    return true;
  },

  treeFor(name) {
    if (!this.isEnabled()) {
      return;
    }

    return this._super.treeFor.apply(this, arguments);
  },

  treeForPublic() {
    var CreateListOfTests = require('./create-list-of-tests');

    return new CreateListOfTests('tests');
  },

  isEnabled: function() {
    return this.app.env !== 'development';
  }
};
