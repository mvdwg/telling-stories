import Ember from 'ember';
import POINTER_DATA from './pointer-data';

const { $, RSVP } = Ember;

const POINTER_SPEED = 300; // pixels/sec
const SCROLL_SPEED = 500; // pixels/sec

const START_TO_DELETE_DELAY = 300;
const DELETE_SPEED = 15; // letters per second

const START_TO_WRITE_DELAY = 300;
const WRITE_SPEED = 9; // leters per second

const SUPPORTED_TRIGGER_EVENTS = ['keyup', 'keydown', 'focus', 'blur'];

const LONG_TEXT_LENGTH = 30;

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
  return sleep(500).then(function() {
    pointer(container).removeClass('tsClick');
  });
}

function _distance(a,b) {
  return Math.sqrt(Math.pow(b.left - a.left, 2) + Math.pow(b.top - a.top, 2));
}

function _mouseMovementDelay(from, to) {
  return Math.round(_distance(from, to) / (POINTER_SPEED / 1000));
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

function _destroyPointer(container) {
  $('#tsPointer', container).remove();
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

function _canSelect($input) {
  return WRITABLE_INPUT_TYPES.includes($input[0].type) || $input.is('textarea');
}

function _deleteTextFromInput($input) {
  return new RSVP.Promise((resolve) => {
    sleep(START_TO_DELETE_DELAY).then(() => {
      let isLongText = $input.val().length >= LONG_TEXT_LENGTH;
      let promise = isLongText ? _deleteLongText($input) : _deleteShortText($input);
      promise.then(() => {
        resolve();
      });
    });
  });
}

function _deleteShortText($input) {
  return new RSVP.Promise((resolve) => {
    let deleteTimer = window.setInterval(function() {
      let currentText = $input.val();

      if (currentText.length !== 0) {
        $input.val(currentText.slice(0, -1));
        return;
      }

      window.clearInterval(deleteTimer);
      resolve();
    }, 1000 / DELETE_SPEED);
  });
}

function _deleteLongText($input) {
  return new RSVP.Promise((resolve) => {
    selectText($input).then(() => {
      sleep(300).then(() => {
        $input.val('');
        resolve();
      });
    });
  });
}

function _triggerKeyEvent(selector, container, eventName, eventOptions) {
  return new RSVP.Promise((resolve) => {
    let eventTooltip = $('#tsKeystroke', container);

    if (!eventTooltip.length) {
      $(container).append($(`<span id="tsKeystroke"><span class="event-type"></span><span class="key"></span></span>`));
      eventTooltip = $('#tsKeystroke', container);
    }

    let $element = $(selector, container);
    $element.focus();
    _triggerFocusBlurEvent(selector, 'focus').then(() => {
      let keyInfo = 'enter';
      if (eventOptions && eventOptions.keyCode && eventOptions.keyCode !== 13) {
        keyInfo = `CODE ${eventOptions.keyCode}`;
      }

      log(`${eventName} ${keyInfo} in ${selector}`, 'ts-log-message-event');

      eventTooltip.find('.event-type').text(eventName);
      eventTooltip.find('.key').text(keyInfo.toUpperCase());
      eventTooltip.fadeTo(300, 1, () => {
        sleep(1200).then(() => {
          eventTooltip.fadeTo(300, 0, () => {
            eventTooltip.remove();
            resolve();
          });
        });
      });
    });
  });
}

function _triggerFocusBlurEvent(selector, eventName) {
  return new RSVP.Promise((resolve) => {
    let action = eventName === 'focus'? 'got': 'lost';
    log(`${selector} ${action} focus`, 'ts-log-message-event');

    sleep(300).then(() => resolve());
  });
}

function triggerEvent(selector, container, eventName, eventOptions) {
  if (!SUPPORTED_TRIGGER_EVENTS.includes(eventName)) {
    return;
  }

  if (['keyup', 'keydown'].includes(eventName)) {
    return _triggerKeyEvent(selector, container, eventName, eventOptions);
  }

  return _triggerFocusBlurEvent(selector, eventName);
}

function selectText($input) {
  return new RSVP.Promise((resolve, reject) => {
    if ($input && _canSelect($input)) {
      sleep(300).then(() => {
        $input.select();
        resolve();
      });
    } else {
      reject('Input is undefined or not selectable.');
    }
  });
}

function movePointer(target, container, easing = "swing") {
  let result;
  let $target = $(target.selector, target.container);

  if(!_isElementInViewport($target)) {
    result = scrollToElement($target, 150);
  } else {
    result = RSVP.resolve();
  }

  return result.then(function() {
    return new RSVP.Promise(function(resolve) {

      let scrollPos = $(window).scrollTop();
      let offset = $target.offset();
      let width = $target.outerWidth(true); // Includes border, paddings and margins
      let height = $target.outerHeight(true); // Includes border, paddings and margins
      let origin = pointer(container).offset();

      origin.top = origin.top - scrollPos;

      offset.left = offset.left + (width / 2);
      offset.top = offset.top + (height / 2) - scrollPos;

      let duration = _mouseMovementDelay(origin, offset);

      $(pointer(container)).animate({
        top: offset.top,
        left: offset.left
      }, duration, easing, resolve);
    });
  });
}

function _isElementInViewport($element, fullyInView) {
  let displayHeight = $(window).height();
  let elementTop = $element.offset().top;
  let elementBottom = elementTop + $element.outerHeight(); // Includes borders and padding but excludes margins.

  if (fullyInView) {
    return ((elementBottom <= displayHeight) && (elementTop >= 0));
  } else {
    return ((0 < elementTop) && (displayHeight > elementBottom));
  }
}

function scrollToElement($element, delay = 0, easing="swing") {
  let moveTo = $element.offset().top + ($element.height() / 2) + ($(window).height() / 2);
  let currentPos = $(document).scrollTop();
  let duration = Math.abs(currentPos - moveTo) / (SCROLL_SPEED / 1000);

  if (moveTo > $(document).height()) {
    moveTo = $(document).height();
  }

  return new RSVP.Promise(function(resolve) {
    $('html, body').delay(delay).animate({
      scrollTop: moveTo
    }, duration, easing, resolve);
  });
}

function show(container) {
  removeBlur();
  pointer(container);
  return new RSVP.Promise(function(resolve) {
    $('body').show(function(){
      resolve();
    });
  });
}

function finish(container) {
  return new RSVP.Promise(function(resolve) {
    $('body')
      .delay(1000)
      .fadeOut(3000, function() {
        logContainer().html('');
        _destroyPointer(container);
        resolve();
      });
  });
}

function osd(moduleName, testName, timeout) {
  timeout = timeout || 5000;
  moduleName = 'Feature: ' + moduleName.replace('Acceptance | ','');

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
  triggerEvent,
  selectText,
  show
};
