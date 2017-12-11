let modules = {};

let emptyFn = () => {};

function runItemFn(index, fnQueue) {
  let fn = fnQueue[index];
  // let next = fnQueue[index + 1] || emptyFn;
  if (!fn) {
    return emptyFn();
  }
  return fn(() => {
    return runItemFn(index + 1, fnQueue);
  });
}

class ValleyModule {
  constructor(input) {
    input = input || {};
    this.queue = [];
  }
  init() {
    this.runQueue();
  }
  add(fn) {
    if (typeof fn === 'function') {
      this.queue.push(fn);
    }
  }
  runQueue() {
    // this.queue.forEach((fn,i) => console.log(i, fn.toString()))
    return runItemFn(0, this.queue);
  }
}

// export default ValleyModule;
module.exports = ValleyModule;
