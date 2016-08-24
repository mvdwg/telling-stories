/*jshint node:true*/
module.exports = {
  description: 'Install telling-stories dependencies',

  normalizeEntityName: function() {},

  afterInstall: function(/*options*/) {
    this.addAddonsToProject({
      // To reference packages using npm version see https://github.com/runspired/ember-radar/blob/27e2d6acacbda2c5e9a36c64f111e4f728fa7b2a/blueprints/ember-radar/index.js
      packages: [
        'ember-cli-page-object',
        'telling-stories-dashboard'
      ]
    });
  }
};
