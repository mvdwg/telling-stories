import Ember from 'ember';

const { $, RSVP } = Ember;

// 100px in 1000ms
const SPEED = 100 / 800;

function sleep(milliseconds) {
  return new RSVP.Promise(function(resolve) {
    window.setTimeout(function() {
      resolve();
    }, milliseconds);
  });
}

function distance(a,b) {
  return Math.sqrt(Math.pow(b.left - a.left, 2) + Math.pow(b.top - a.top, 2));
}

function delay(from, to) {
  return Math.round(1 / (SPEED / distance(from, to)));
}

/**
 * Gets mouse pointer element
 *
 * @param {HTMLElement|jQuery|String} container - where to look for the mouse pointer
 * @return {jQuery} element that represents the mouse pointer
 */
function pointer(container) {
  let pointer = $('#tsPointer', container);

  if (!pointer.length) {
    $(container).append($('<img>', {
      id: 'tsPointer',
      src: '/telling-stories/pointer.png'
    }));

    pointer = $('#tsPointer', container);
  }

  return pointer;
}

function movePointerTo(target) {
  return function() {
    let $target = $(target);
    let offset = $target.offset();
    let width = $target.width() / 2 - 13;
    let height = $target.height() / 2 + 3;

    offset.left = offset.left + width;
    offset.top = offset.top + height;

    let ms = delay(pointer('#ember-testing').offset(), offset, SPEED);

    pointer('#ember-testing').offset(offset);
    pointer('#ember-testing').css('transition', `all ${ms}ms`);

    return sleep(ms + 100); // wait the delay plus a delta
  };
}

export default {
  pointer,
  movePointerTo,
  sleep(milliseconds) {
    return () => sleep(milliseconds);
  }
};
