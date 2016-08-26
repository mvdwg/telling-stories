/*jshint node:true*/
module.exports = {
  description: 'Install telling-stories dependencies',

  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [
        { name: 'ember-cli-page-object', version: '^1.6.0' },
        { name: 'telling-stories-dashboard', version: '1.0.0-alpha.1' }
      ]
    });
  }
};
