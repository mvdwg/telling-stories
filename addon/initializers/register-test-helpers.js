import Ember from 'ember';

const { RSVP } = Ember;

Ember.Test.registerAsyncHelper('tsWait', function(app, millisecondsOrPromise) {
  return new RSVP.Promise(function(resolve) {
    if (typeof millisecondsOrPromise === 'number') {
      window.setTimeout(function() {
        resolve();
      }, millisecondsOrPromise);
    } else {
      resolve(millisecondsOrPromise);
    }
  });
});

export default {
  name: 'register-test-helpers',
  initialize: function() {}
};
