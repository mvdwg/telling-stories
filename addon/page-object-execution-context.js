import { buildSelector } from 'ember-cli-page-object';
import Animation from './animation';

const defaultContainer = '#ember-testing';

export default function TellingStoriesContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

let previousElement = null;

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
    wait()
      .then(Animation.movePointerTo(selector, container || defaultContainer))
      .then(Animation.clickEffectBefore());

    /* global click */
    click(selector, container);

    wait().then(Animation.clickEffectAfter());
  },

  fillIn(selector, container, text) {
    /* global wait */
    wait()
      .then(Animation.movePointerTo(selector, container || defaultContainer))
      .then(Animation.clickEffectBefore());

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

    this.attention(result);

    return result;
  },

  findWithAssert(selector, options) {
    let result;

    selector = buildSelector(this.pageObjectNode, selector, options);

    /* global find */
    result = find(selector, options.testContainer);

    if (result.length === 0) {
      throw new Error("Ooops!");
    }

    this.attention(result);

    return result;
  },

  attention(element) {
    wait().then(() => {
      if (previousElement) {
        previousElement.removeClass('tsAttention');
      }

      previousElement = element.addClass('tsAttention');

      return Animation.sleep(1000)();
    });
  }
};
