/*jshint node:true*/

var existsSync = require('exists-sync');

module.exports = {
  description: 'Install telling-stories dependencies',

  normalizeEntityName: function() {},

  afterInstall: function() {
    // Register shutdown animation to the end of every acceptance test
    if (existsSync('tests/helpers/module-for-acceptance.js')) {
      this.insertIntoFile('tests/helpers/module-for-acceptance.js', "      afterEach = window.require('telling-stories').shutdown(afterEach);", {
        after: "let afterEach = options.afterEach && options.afterEach.apply(this, arguments);\n"
      });
    }

    return this.addAddonsToProject({
      packages: [
        { name: 'ember-cli-page-object', version: '^1.6.0' }
      ]
    });
  }
};
