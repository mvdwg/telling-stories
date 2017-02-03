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
  constructor(container) {
    super();
    this.container = container;
  }

  // Generic action
  then(fn) {
    this.addTask(fn);

    return this;
  }

  // Player actions
  beforeVisit(testName) {
    this.addTask(Animation.osd, testName);

    return this;
  }

  afterVisit() {
    this.addTask(sleep, 3000);
    this.flushTasks();

    return this;
  }

  beforeClick($element) {
    this.addTask(Animation.movePointer, $element, this.container);
    this.addTask(Animation.beforeClick, this.container);
    this.flushTasks();

    return this;
  }

  afterClick() {
    this.addTask(Animation.afterClick, this.container);
    this.flushTasks();

    return this;
  }
}

// Singleton instance of Player
var current = null;

export function player() {
  if (!current) {
    throw new Error('You need to start a player first');
  }

  return current;
}

export function create(container) {
  current = new Player(container);
}
