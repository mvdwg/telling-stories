import Ember from 'ember';
import { buildSelector } from 'ember-cli-page-object';
import Animation from './animation';

const { $ } = Ember;

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

  click(selector, container) {
    /* global andThen */
    andThen(function() {
      Animation.movePointerTo(selector);
    });

    /* global tsWait */
    tsWait(2000);

    /* global click */
    click(selector, container);
  },

  fillIn(selector, container, text) {
    /* global andThen */
    andThen(function() {
      Animation.movePointerTo(selector);
    });

    tsWait(2000);

    /* global fillIn */
    if (container) {
      fillIn(selector, container, text);
    } else {
      fillIn(selector, text);
    }
  },

  triggerEvent(selector, container, eventName, eventOptions) {
    tsWait(500);
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
