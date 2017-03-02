import { buildSelector } from 'ember-cli-page-object';
import { findClosestValue } from 'ember-cli-page-object/-private/helpers';
import { player } from './player';

/* global click */
/* global wait */
/* global fillIn */
/* global visit */
/* global triggerEvent */
/* global find */

export default function TellingStoriesContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

TellingStoriesContext.prototype = {
  run(cb) {
    return cb(this);
  },

  runAsync(cb) {
    wait().then(() => {
      cb(this);
    });

    return this.pageObjectNode;
  },

  visit(path) {
    visit(path);
    player().afterVisit();
  },

  click(selector, container) {
    container = container || '#ember-testing';

    player()
      .beforeClick({selector, container})
      .then(() => click(selector, container))
      .afterClick();
  },

  fillIn(selector, container, text) {
    container = container || '#ember-testing';

    player()
      .beforeFillIn({selector, container, text})
      .then(() => {
        fillIn(selector, container, text);
      })
      .afterFillIn();
  },

  triggerEvent(selector, container, eventName, eventOptions) {
    container = container || '#ember-testing';

    player()
      .beforeTriggerEvent({selector, container, eventName, eventOptions})
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
