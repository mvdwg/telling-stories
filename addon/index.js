import Ember from 'ember';
import Animation from './animation';
import pendingTasks from './pending-tasks';
import ExecutionContext from './page-object-execution-context';

// -- new api
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

export function suiteStart(totalTests) {
  console.log(`Test suite starts. Total tests: ${totalTests}`);

  if ($('#test-root').length) {
    // ember twiddle
    container = '#test-root';
  } else {
    container = '#ember-testing';
  }
}

export function suiteEnd() {
  console.log('Test suite ends');
}

export function moduleStart(name) {
  console.log(`Module starts: ${name}`);
}

export function moduleEnd() {
  console.log('Module ends');
}

export function testStart(context) {
  console.log(`Test starts: %o`, context);

  pendingTasks.clear();

  if (/^Acceptance/.test(context.module)) {
    createPlayer(container);
    player().beforeVisit(context.name);
  }
}

export function testEnd() {
  console.log(`Test ends`);
  pendingTasks.clear();
}

export function assertionEnded({message}) {
  message = $.trim(message);

  if (message) {
    player().afterAssertion(message);
  }
}
