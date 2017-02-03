import Ember from 'ember';
import { buildSelector } from 'ember-cli-page-object';
import { findClosestValue } from 'ember-cli-page-object/-private/helpers';
import Animation from './animation';
import pendingTasks from './pending-tasks';

/* global click */
/* global wait */
/* global fillIn */
/* global visit */
/* global triggerEvent */
/* global find */

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
    player().afterVisit();
  },

  click(selector, container) {
    container = container || '#ember-testing';

    this.flushTasks(); // temp

    player()
      .beforeClick({selector, container})
      .then(() => click(selector, container))
      .afterClick();
  },

  fillIn(selector, container, text) {
    container = container || '#ember-testing';

    this.flushTasks();

    player()
      .beforeFillIn({selector, container})
      .then(() => {
        fillIn(selector, container, text);
      })
      .afterFillIn();
  },

  triggerEvent(selector, container, eventName, eventOptions) {
    container = container || '#ember-testing';

    this.flushTasks();

    player()
      .beforeTriggerEvent()
      .then(() => triggerEvent(selector, container, eventName, eventOptions));
  },

  assertElementExists(selector, options) {
    let result = find(selector, options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer'));

    if (result.length === 0) {
      throw new Error("Ooops!");
    }
  },

  find(selector, options) {
    let result;
    selector = buildSelector(this.pageObjectNode, selector, options);

    result = find(selector, options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer'));

    this.attention(result);

    return result;
  },

  findWithAssert(selector, options) {
    let result;

    selector = buildSelector(this.pageObjectNode, selector, options);

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
