import Ember from 'ember';
import { player, create as createPlayer } from './player';

const { RSVP, $ } = Ember;

var container;

export function shutdown(returnValue) {
  let promise = RSVP.resolve(returnValue);

  if (window.QUnit && window.QUnit.urlParams.tellingStories) {
    return new RSVP.Promise(function(resolve) {
      player()
        .beforeEnd()
        .then(() => resolve(promise));
    });
  }

  return promise;
}

export function suiteStart() {
  if ($('#test-root').length) {
    container = '#test-root'; // ember-twiddle
  } else {
    container = '#ember-testing';
  }
}

export function suiteEnd() {
}

export function moduleStart() {
}

export function moduleEnd() {
}

export function testStart(context) {
  if (/^Acceptance/.test(context.module)) {
    createPlayer(container, context);
    player().beforeVisit(context.name);
  }

  if (window.parent) {
    window.parent.postMessage("telling-stories:testStart", "*");
  }
}

export function testEnd() {
  if (window.parent) {
    window.parent.postMessage("telling-stories:testEnd", "*");
  }
}

export function assertionEnded({message, expected, actual, result}) {
  message = $.trim(message);
  if (message) {
    player().afterAssertion(result, expected, actual, message);
  } else {
    message = `Expected "${expected}", ok`;
    player().afterAssertion(result, expected, actual, message);
  }
}
