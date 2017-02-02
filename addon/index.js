import Ember from 'ember';
import Animation from './animation';
import pendingTasks from './pending-tasks';
import ExecutionContext from './page-object-execution-context';

const { RSVP, $ } = Ember;

export function shutdown(returnValue) {
  let promise = RSVP.resolve(returnValue);

  if (window.QUnit && window.QUnit.urlParams.tellingStories) {
    pendingTasks.push(function() {
      return Animation.log('The End', 'ts-the-end');
    });
    pendingTasks.push(Animation.sleep(2000));
    pendingTasks.push(function() {
      return Animation.finish();
    });

    return ExecutionContext.prototype.flushTasks().then(() => promise);
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

  pendingTasks.clear();

  if (/^Acceptance/.test(context.module)) {
    pendingTasks.push(function() {
      return Animation.osd(context.name);
    });
  }
}

export function testEnd() {
  console.log(`Test ends`);
  pendingTasks.clear();
}

export function assertionEnded({message}) {
  if ($.trim(message)) {
    pendingTasks.push(function() {
      return Animation.log($.trim(message));
    });
  }
}

RSVP.on('error', function(reason) {
  console.error(reason);
});
