import Ember from 'ember';

const { $ } = Ember;

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
      src: '/telling-stories/pointer.png',
    }));

    pointer = $('#tsPointer', container);
  }

  return pointer;
}

function movePointerTo(target) {
  let $target = $(target);
  let offset = $target.offset();
  let width = $target.width() / 2 - 13;
  let height = $target.height() / 2 + 7;

  offset.left = offset.left + width;
  offset.top = offset.top + height;

  pointer('#ember-testing').offset(offset);
}

export default {
  pointer,
  movePointerTo
};
