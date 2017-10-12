import { player } from './player';

/* global window */

export default function overrideHelpers() {
  let oldClick = window.click;
  let oldFillIn = window.fillIn;
  let oldVisit = window.visit;
  let oldTriggerEvent = window.triggerEvent;

  window.visit = function visit(path) {
    oldVisit(path);
    player().afterVisit(path);
  }

  window.click = function click(selector, container) {
    container = container || '#ember-testing';

    player()
      .beforeClick({selector, container})
      .then(() => oldClick(selector, container))
      .afterClick();
  }

  window.fillIn = function fillIn(selector, container, text) {
    container = container || '#ember-testing';

    player()
      .beforeFillIn({selector, container, text})
      .then(() => {
        oldFillIn(selector, container, text);
      })
      .afterFillIn();
  }

  window.triggerEvent = function triggerEvent(selector, container, eventName, eventOptions) {
    container = container || '#ember-testing';

    player()
      .beforeTriggerEvent({selector, container, eventName, eventOptions})
      .then(() => oldTriggerEvent(selector, container, eventName, eventOptions));
  }
}
