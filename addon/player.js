/* global wait, $ */
import Ember from 'ember';
import Animation from './animation';

const { RSVP } = Ember;

function task(fn, args) {
  return function() {
    return fn.apply(null, args);
  };
}

function sleep(milliseconds) {
  return new RSVP.Promise(function(resolve) {
    window.setTimeout(function() {
      resolve();
    }, milliseconds);
  });
}

class BasePlayer {
  constructor() {
    this.pendingTasks = [];
  }

  flushTasks() {
    let tasks = this.pendingTasks;

    this.pendingTasks = [];

    if (tasks.length) {
      tasks.forEach((task) => {
        wait().then(task);
      });

      return wait();
    }

    return RSVP.resolve();
  }

  addTask(fn, ...args) {
    this.pendingTasks.push(task(fn, args));
  }
}

class Player extends BasePlayer {
  constructor(container, moduleName, testName) {
    super();

    this.container = container;
    this.moduleName = moduleName;
    this.testName = testName;
    this.success = true;
    this.pausePromise = null;

    this.initPlayerControls(); // Init playback controls.

    this.addTask(Animation.show, this.container);
    this.addTask(Animation.osd, this.moduleName, testName);
  }

  initPlayerControls() {
    $('body').append(`<div id="tsToolBar" class="ts-toolbar">
      <button id="btnTogglePlay" class="ts-toolbar--action">PAUSE</button>
      <span id="playerInfo" class="ts-toolbar--info"></span>
    </div>`);

    $('#btnTogglePlay').on('click', () => this.togglePlay());
  }

  togglePlay() {
    if (this.pausePromise) {
      this._play();
    } else {
      this._pause();
    }
  }

  _play() {
    this.pausePromise.resolve();
    this.pausePromise = null;
    let toolbar = $('#tsToolBar');
    toolbar.removeClass('ts-toolbar__stop');
    $('#btnTogglePlay').text('PAUSE');
    $('#playerInfo').text('');

    this.flushTasks();
  }

  _pause() {
    let toolbar = $('#tsToolBar');
    toolbar.addClass('ts-toolbar__stop');
    $('#btnTogglePlay').text('PLAY');
    $('#playerInfo').text('Player is in pause, now you can inspect elements and see what is exactly happens.');

    this.pausePromise = RSVP.defer();

    this.addTask(() => this.pausePromise.promise);
  }

  // Generic action
  then(fn) {
    this.addTask(fn);
    this.flushTasks();

    return this;
  }

  // Player actions
  beforeVisit() {
    return this;
  }

  afterVisit(path) {
    this.addTask(Animation.log, `Visit ${path}`, 'ts-log-message');
    this.addTask(sleep, 3000);
    this.flushTasks();

    return this;
  }

  beforeClick(element) {
    this.addTask(Animation.movePointer, element, this.container);
    this.addTask(Animation.beforeClick, this.container);
    this.flushTasks();

    return this;
  }

  afterClick() {
    this.addTask(Animation.afterClick, this.container);
    this.flushTasks();

    return this;
  }

  beforeFillIn(context) {
    this.beforeClick(context);
    this.addTask(Animation.typing, context.selector, context.text, this.container);
    return this;
  }

  afterFillIn() {
    return this;
  }

  beforeTriggerEvent(context) {
    this.addTask(Animation.triggerEvent, context.selector, context.container, context.eventName, context.eventOptions);
    this.flushTasks();

    return this;
  }

  afterAssertion(result, expected, actual, message) {
    let className = 'ts-log-message';

    if (!result) {
      this.success = false;
      className += '-error';
      message += `\r\nExpected: "${expected}"" but instead: "${actual}".`;
    }

    this.addTask(Animation.log, message, className);
    this.flushTasks();

    return this;
  }

  beforeEnd() {
    let className = 'ts-the-end';

    if (!this.success) {
      className += '-error';
    }
    this.addTask(Animation.log, 'THE END', className);
    this.addTask(sleep, 3000);
    this.addTask(Animation.finish, this.container);
    this.flushTasks();

    return this;
  }

  destroy() {
    // Clean up all the resources before destroy the player.
    return new RSVP.Promise((resolve) => {
      if($('#tsToolBar').length > 0) {
        $('#tsToolBar').remove();
      }

      resolve();
    });
  }
}

// Singleton instance of Player
let currentPlayer = null;

export function player() {
  if (!currentPlayer) {
    console.warn('You need to start a player first');
  }

  return currentPlayer;
}

export function create(container, context) {
  currentPlayer = new Player(container, context.module, context.name);
}
