import { buildSelector } from 'ember-cli-page-object';

export default function TellingStoriesContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

function cursor() {
  let cursor = $('#ember-testing #the-cursor');

  if (!cursor.length) {
    $('#ember-testing').append($('<img>', {
      id: 'the-cursor',
      src: '/telling-stories/mouse_cursor.png',
      style: 'width:25px;position:absolute;left:0;top:0;transition:all 2s'
    }));

    cursor = $('#ember-testing #the-cursor');
  }

  return cursor;
}

/* global $ */

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
      let offset = $(selector).offset();
      cursor().offset(offset);
    });

    delay(2000);

    /* global click */
    click(selector, container);
  },

  fillIn(selector, container, text) {
    /* global andThen */
    andThen(function() {
      let offset = $(selector).offset();
      cursor().offset(offset);
    });
    delay(2000);

    /* global fillIn */
    if (container) {
      fillIn(selector, container, text);
    } else {
      fillIn(selector, text);
    }
  },

  triggerEvent(selector, container, eventName, eventOptions) {
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
      throw new Error("Ooops!");
    }

    return result;
  }
};
