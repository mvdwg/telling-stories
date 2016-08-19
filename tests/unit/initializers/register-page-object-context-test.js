import Ember from 'ember';
import RegisterPageObjectContextInitializer from 'dummy/initializers/register-page-object-context';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | register page object context', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  RegisterPageObjectContextInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
