import Animation from './animation';

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
  constructor(waiter) {
    super(waiter);
  }

  // Player actions
  beforeStart(testName) {
    this.addTask(Animation.osd, testName);
  }

  start() {
    this.addTask(sleep, 3000);
    this.flushTasks();
  }
}

// Singleton instance of Player
var current = null;

export function player() {
  return current;
}

export function create() {
  current = new Player();
}
