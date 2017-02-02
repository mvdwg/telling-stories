var pendingTasks = [];

export function clear() {
  pendingTasks = [];
}

export function push(fn) {
  pendingTasks.push(fn);
}

export function flush() {
  let tmp = pendingTasks;
  pendingTasks = [];

  return tmp;
}
