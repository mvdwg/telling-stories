import Ember from 'ember';

const { $, RSVP } = Ember;

// 100px in 1000ms
const SPEED = 100 / 400;

const SCROLL_SPEED = 2000;

function sleep(milliseconds) {
  return new RSVP.Promise(function(resolve) {
    window.setTimeout(function() {
      resolve();
    }, milliseconds);
  });
}

function clickEffectBefore() {
  pointer('#ember-testing').addClass('tsClick');
  return sleep(300);
}

function clickEffectAfter() {
  return sleep(1000).then(() => pointer('#ember-testing').removeClass('tsClick'));
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
    let $img = $('<img>', { src: '/telling-stories/pointer.png' });
    let $click = $('<span>', { id: 'tsPointerClickEffect'});
    let $cursor = $('<span>', { id: 'tsPointer' });

    $cursor.append($click, $img);

    $(container).append($cursor);

    pointer = $('#tsPointer', container);
  }

  return pointer;
}

function movePointerTo(target) {
  return function() {
    let $target = $(target);
    let offset = $target.offset();
    let width = $target.width() / 2;
    let height = $target.height() / 2 + 3;

    offset.left = offset.left + width;
    offset.top = offset.top + height;

    let ms = delay(pointer('#ember-testing').offset(), offset, SPEED);

    pointer('#ember-testing').offset(offset);
    pointer('#ember-testing').css('transition', `top ${ms}ms cubic-bezier(0.4, 0, 1, 1), left ${ms}ms linear`);

    if(!isElementInView(target)) {
      scrollToElement(target);
    }

    return sleep(ms + 100); // wait the delay plus a delta
  };
}

function isElementInView(element, fullyInView) {
  let pageTop = $(window).scrollTop();
  let pageBottom = pageTop + $(window).height();
  let elementTop = $(element).offset().top;
  let elementBottom = elementTop + $(element).height();

  if (fullyInView === false) {
      return ((pageTop < elementTop) && (pageBottom > elementBottom));
  } else {
      return ((elementBottom <= pageBottom) && (elementTop >= pageTop));
  }
}

function scrollToElement(element) {
  $('html, body').animate({
    scrollTop: $(element).offset().top
  }, SCROLL_SPEED);
}

export default {
  pointer,
  movePointerTo,
  clickEffectBefore() {
    return () => clickEffectBefore();
  },
  clickEffectAfter() {
    return () => clickEffectAfter();
  },
  sleep(milliseconds) {
    return () => sleep(milliseconds);
  }
};
