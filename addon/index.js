import Ember from 'ember';
import Animation from './animation';

const { RSVP } = Ember;

export function shutdown(returnValue) {
  let promise = RSVP.resolve(returnValue);

  if (window.QUnit && window.QUnit.urlParams.tellingStories) {
    return Animation.sleep(3000)().then(() => promise);
  }

  return promise;
}
