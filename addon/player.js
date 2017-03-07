/* global wait */
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
    // global wait
    var tasks = this.pendingTasks;

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

    this.addTask(Animation.show, this.container);
    this.addTask(Animation.osd, this.moduleName, testName);
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
}

// Singleton instance of Player
var current = null;

export function player() {
  if (!current) {
    console.warn('You need to start a player first');
  }

  return current;
}

export function create(container, context) {
  current = new Player(container, context.module, context.name);
}
