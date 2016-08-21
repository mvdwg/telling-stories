import Ember from 'ember';
import RegisterTestHelpersInitializer from 'dummy/initializers/register-test-helpers';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | register test helpers', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  RegisterTestHelpersInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
