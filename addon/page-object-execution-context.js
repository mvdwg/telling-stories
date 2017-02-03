import Ember from 'ember';
import { buildSelector } from 'ember-cli-page-object';
import { findClosestValue } from 'ember-cli-page-object/-private/helpers';
import Animation from './animation';
import pendingTasks from './pending-tasks';

// -- new api
import { player } from './player';

const { RSVP } = Ember;

export default function TellingStoriesContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

// let previousElement = null;

TellingStoriesContext.prototype = {
  flushTasks() {
    var tasks = pendingTasks.flush();
    if (tasks.length) {
      tasks.forEach(function(task) {
        wait().then(task);
      });

      return wait();
    }

    return RSVP.resolve();
  },

  run(cb) {
    return cb(this);
  },

  runAsync(cb) {
    /* global wait */
    wait().then(() => {
      cb(this);
    });

    return this.pageObjectNode;
  },

  visit(path) {
    /* global visit */
    visit(path);
    player().start();
  },

  click(selector, container) {
    this.flushTasks();
    container = container || '#ember-testing';

    /* global wait */
    wait()
      .then(Animation.movePointerTo(selector, container))
      .then(Animation.clickEffectBefore(container));

    /* global click */
    click(selector, container);

    wait().then(Animation.clickEffectAfter(container));
  },

  fillIn(selector, container, text) {
    this.flushTasks();
    container = container || '#ember-testing';

    /* global wait */
    wait()
      .then(Animation.movePointerTo(selector, container))
      .then(Animation.clickEffectBefore(container));

    /* global fillIn */
    if (container) {
      fillIn(selector, container, text);
    } else {
      fillIn(selector, text);
    }
  },

  triggerEvent(selector, container, eventName, eventOptions) {
    this.flushTasks();
    container = container || '#ember-testing';

    /* global wait */
    wait().then(Animation.sleep(500));

    /* global triggerEvent */
    triggerEvent(selector, container, eventName, eventOptions);
  },

  assertElementExists(selector, options) {
    /* global find */
    let result = find(selector, options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer'));

    if (result.length === 0) {
      throw new Error("Ooops!");
    }
  },

  find(selector, options) {
    let result;
    selector = buildSelector(this.pageObjectNode, selector, options);

    /* global find */
    result = find(selector, options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer'));

    this.attention(result);

    return result;
  },

  findWithAssert(selector, options) {
    let result;

    selector = buildSelector(this.pageObjectNode, selector, options);

    /* global find */
    result = find(selector, options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer'));

    if (result.length === 0) {
      throw new Error("Ooops!");
    }

    this.attention(result);

    return result;
  },

  attention(/* element */) {
    // wait().then(() => {
    //   if (previousElement) {
    //     previousElement.removeClass('tsAttention');
    //   }
    //
    //   previousElement = element.addClass('tsAttention');
    //
    //   return Animation.sleep(1000)();
    // });
  }
};
