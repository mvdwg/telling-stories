import Ember from 'ember';
import POINTER_DATA from './pointer-data';

const { $, RSVP } = Ember;

const SPEED = 100 / 300; // 100px in 300ms
const SCROLL_SPEED = 500;
const START_TO_DELETE_DELAY = 300;
const DELETE_SPEED = 7; // letters per second
const START_TO_WRITE_DELAY = 300;
const WRITE_SPEED = 5; // leters per second
const WRITABLE_INPUT_TYPES = ['text', 'email', 'tel', 'password', 'url', 'number'];


function sleep(milliseconds) {
  return new RSVP.Promise(function(resolve) {
    window.setTimeout(function() {
      resolve();
    }, milliseconds);
  });
}

function beforeClick(container) {
  pointer(container).addClass('tsClick');
  return sleep(200);
}

function afterClick(container) {
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

function typing(element, text, container) {
  const $input = $(element, container);

  if (!_canWrite($input)) {
    return;
  }

  $input.trigger('focus'); // Apply styles to the control.

  return _deleteTextFromInput($input).then(function() {
    return sleep(START_TO_WRITE_DELAY);
  }).then(function() {
    return new RSVP.Promise(function(resolve) {
      let index = 0;
      let typingTimer = window.setInterval(function() {

        let currentText = $input.val();

        if (currentText.length !== text.length) {
          let letter = text[index];
          $input.val(`${currentText}${letter}`);
          index++;
          return;
        }

        window.clearInterval(typingTimer);
        resolve();

      }, 1000 / WRITE_SPEED);
    });
  });
}

function _canWrite($input) {
  let isValidElement = WRITABLE_INPUT_TYPES.includes($input[0].type) || $input.is('textarea');
  let isWritable = !$input.is(':disabled') && !$input.is('[readonly]');
  return  isValidElement && isWritable;
}

function _deleteTextFromInput($input) {
  return sleep(START_TO_DELETE_DELAY).then(function() {
    return new RSVP.Promise(function(resolve) {
      let deleteTimer = window.setInterval(function() {
        let currentText = $input.val();

        if (currentText.length !== 0) {
          let textAfterDelete = currentText.slice(0, -1);
          $input.val(textAfterDelete);
          return;
        }

        window.clearInterval(deleteTimer);
        resolve();

      }, 1000 / DELETE_SPEED);
    });
  });
}

function movePointer(target, container) {
  let $target = $(target.selector, target.container);
  let offset = $target.offset();
  let width = $target.outerWidth(true) / 2; // Includes border, paddings and margins
  let height = $target.outerHeight(true) / 2; // Includes border, paddings and margins

  offset.left = offset.left + width;
  offset.top = offset.top + height;

  let ms = delay(pointer(container).offset(), offset, SPEED);

  $(pointer(container)).animate({
    top: offset.top,
    left: offset.left
  }, ms);

  if(!isElementInView($target)) {
    scrollToElement($target, 150, ms);
  }

  return sleep(ms + 100); // wait the delay plus a delta
}

function isElementInView($element, fullyInView) {
  let displayHeight = $(window).height();
  let elementTop = $element.offset().top;
  let elementBottom = elementTop + $element.outerHeight(); // Includes borders and padding but excludes margins.

  if (fullyInView) {
    return ((elementBottom <= displayHeight) && (elementTop >= 0));
  } else {
    return ((0 < elementTop) && (displayHeight > elementBottom));
  }
}

function scrollToElement($element, delay = 0, duration = SCROLL_SPEED) {
  let moveTo = $element.offset().top + ($element.height() / 2) + ($(window).height() / 2);

  if (moveTo > $(document).height()) {
    moveTo = $(document).height();
  }

  $('html, body').delay(delay).animate({
    scrollTop: moveTo
  }, duration);
}

function show() {
  removeBlur();
  return new RSVP.Promise(function(resolve) {
    $('body').show(function(){
      resolve();
    });
  });
}

function finish() {
  return new RSVP.Promise(function(resolve) {
    $('body')
      .delay(1000)
      .fadeOut(3000, function() {
        logContainer().html('');
        resolve();
      });
  });
}

function osd(moduleName, testName, timeout) {
  timeout = timeout || 5000;
  testName = testName.capitalize();
  moduleName = 'Feature: ' + moduleName.replace('Acceptance | ','').capitalize();

  return new RSVP.Promise(function(resolve) {
    $('<div>', { class: 'tsOSD' })
    .html(`<span class="test-name">${testName}</span><span class="module-name">${moduleName}</span>`)
    .appendTo($('body'));

    sleep(timeout).then(() => {
      $('.tsOSD').addClass('out');
      sleep(800).then(() => {
        addBlur();
        resolve();
        $('.tsOSD').remove();
      });
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

function log(message, className) {
  let timeout = 2000;

  className = className || '';

  return new RSVP.Promise(function(resolve) {
    $('<div>', {
      text: message,
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

function addBlur() {
  $('#ember-testing-container').addClass('no-filter');
}

function removeBlur() {
  $('#ember-testing-container').removeClass('no-filter');
}


export default {
  pointer,
  finish,
  osd,
  log,
  movePointer,
  beforeClick,
  afterClick,
  typing,
  show
};
