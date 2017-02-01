import Ember from 'ember';
import Animation from './animation';

const { RSVP } = Ember;

export function shutdown(returnValue) {
  let promise = RSVP.resolve(returnValue);

  if (window.QUnit && window.QUnit.urlParams.tellingStories) {
    return Animation.finish().then(() => promise);
  }

  return promise;
}

export function suiteStart(totalTests) {
  console.log(`Test suite starts. Total tests: ${totalTests}`);
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
  if (/^Acceptance/.test(context.module)) {
    Animation.osd(context.name);
  }
}

export function testEnd() {
  console.log(`Test ends`);
}
