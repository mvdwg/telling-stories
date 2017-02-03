import Ember from 'ember';
import POINTER_DATA from './pointer-data';

const { $, RSVP } = Ember;

// 100px in 300ms
const SPEED = 100 / 300;

const SCROLL_SPEED = 500;

function sleep(milliseconds) {
  return new RSVP.Promise(function(resolve) {
    window.setTimeout(function() {
      resolve();
    }, milliseconds);
  });
}

function clickEffectBefore(container) {
  pointer(container).addClass('tsClick');
  return sleep(200);
}

function clickEffectAfter(container) {
  return sleep(500).then(() => pointer(container).removeClass('tsClick'));
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
    let $img = $('<img>', { src: POINTER_DATA });
    let $click = $('<span>', { id: 'tsPointerClickEffect'});
    let $cursor = $('<span>', { id: 'tsPointer' });

    $cursor.append($click, $img);

    $(container).append($cursor);

    pointer = $('#tsPointer', container);
  }

  return pointer;
}

function movePointerTo(target, container) {
  return function() {
    let $target = $(target, container);
    let offset = $target.offset();
    let width = $target.width() / 2;
    let height = $target.height() / 2 + 3;

    offset.left = offset.left + width;
    offset.top = offset.top + height;

    let ms = delay(pointer(container).offset(), offset, SPEED);

    pointer(container).offset(offset);
    pointer(container).css('transition', `top ${ms}ms cubic-bezier(0.4, 0, 1, 1), left ${ms}ms linear`);

    if(!isElementInView($target)) {
      scrollToElement($target);
    }

    return sleep(ms + 100); // wait the delay plus a delta
  };
}

function isElementInView($element, fullyInView) {
  let pageTop = $(window).scrollTop();
  let pageBottom = pageTop + $(window).height();
  let elementTop = $element.offset().top;
  let elementBottom = elementTop + $element.height();

  if (fullyInView === false) {
      return ((pageTop < elementTop) && (pageBottom > elementBottom));
  } else {
      return ((elementBottom <= pageBottom) && (elementTop >= pageTop));
  }
}

function scrollToElement($element) {
  $('html, body').animate({
    scrollTop: $element.offset().top + $element.height() - $(window).height()
  }, SCROLL_SPEED);
}

function finish() {
  $('body')
    .delay(4000)
    .fadeOut(3000);

  return sleep(7000).then(function() {
    logContainer().html('');
    $('body').show();
  });
}

function osd(text, timeout) {
  timeout = timeout || 3000;
  $('#ember-testing-container').addClass('ts-blur');

  return new RSVP.Promise(function(resolve) {
    $('<div>', {
      text,
      class: 'tsOSD'
    })
    .appendTo($('body'))
    .animate({
      opacity: 1
    }, timeout, function() {
      $('#ember-testing-container').removeClass('ts-blur');
      resolve();
      $(this).remove();
    });
  });
}

function logContainer() {
  let container = $('.ts-log-container');

  if (!container.length) {
    container = $('<div>', {
      class: 'ts-log-container'
    })
    .appendTo($('body'));
  }

  return container;
}

function log(text, className) {
  let timeout = 2000;

  className = className || '';

  return new RSVP.Promise(function(resolve) {
    $('<div>', {
      text,
      class: 'ts-log-message ' + className
    })
    .hide()
    .appendTo(logContainer())
    .slideDown(500)
    .delay(timeout, function() {
      resolve();
    })
    .fadeOut(400, function() {
      $(this).remove();
    });
  });
}

export default {
  pointer,
  movePointerTo,
  finish,
  osd,
  log,
  clickEffectBefore() {
    return () => clickEffectBefore();
  },
  clickEffectAfter() {
    return () => clickEffectAfter();
  },
  sleep(milliseconds) {
    return () => sleep(milliseconds);
  },

  // -- new api
  movePointer,
  beforeClick,
  afterClick: clickEffectAfter
};

function beforeClick(container) {
  pointer(container).addClass('tsClick');
  return sleep(200);
}

function movePointer($target, container) {
  let offset = $target.offset();
  let width = $target.width() / 2;
  let height = $target.height() / 2 + 3;

  offset.left = offset.left + width;
  offset.top = offset.top + height;

  let ms = delay(pointer(container).offset(), offset, SPEED);

  pointer(container).offset(offset);
  pointer(container).css('transition', `top ${ms}ms cubic-bezier(0.4, 0, 1, 1), left ${ms}ms linear`);

  if(!isElementInView($target)) {
    scrollToElement($target);
  }

  return sleep(ms + 100); // wait the delay plus a delta
}
