import { buildSelector } from 'ember-cli-page-object';
import Animation from './animation';

export default function TellingStoriesContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

TellingStoriesContext.prototype = {
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
  },

  click(selector, container) {
    /* global wait */
    wait().then(Animation.movePointerTo(selector));

    /* global click */
    click(selector, container);
  },

  fillIn(selector, container, text) {
    /* global wait */
    wait().then(Animation.movePointerTo(selector));

    /* global fillIn */
    if (container) {
      fillIn(selector, container, text);
    } else {
      fillIn(selector, text);
    }
  },

  triggerEvent(selector, container, eventName, eventOptions) {
    /* global wait */
    wait().then(Animation.sleep(500));

    /* global triggerEvent */
    triggerEvent(selector, container, eventName, eventOptions);
  },

  assertElementExists(selector, options) {
    /* global find */
    let result = find(selector, options.testContainer);

    if (result.length === 0) {
      throw new Error("Ooops!");
    }
  },

  find(selector, options) {
    let result;
    selector = buildSelector(this.pageObjectNode, selector, options);

    /* global find */
    result = find(selector, options.testContainer);

    return result;
  },

  findWithAssert(selector, options) {
    let result;

    selector = buildSelector(this.pageObjectNode, selector, options);

    /* global find */
    result = find(selector, options.testContainer);

    if (result.length === 0) {
      console.log(selector);
      throw new Error("Ooops!");
    }

    return result;
  }
};
