let modules = {};

let emptyFn = () => {};

function runItemFn(index, fnQueue) {
  let fn = fnQueue[index];
  if (!fn) {
    return emptyFn();
  }
  return fn(() => {
    return runItemFn(index + 1, fnQueue);
  });
}

/**
 * queue
 *    item
 *    - common function
 *    - async function
 *    - modules
 *    - SubClass of ValleyModule
 *    - array of function
 */

class ValleyModule {
  constructor(input) {
    input = input || {};
    this.queue = input.queue || [];
  }
  init(context) {
    this.compose();
    this.context = Object.assign({}, context || {});
    return this.runQueue();
  }
  add(fn) {
    if (typeof fn === 'function') {
      this.queue.push(fn);
    }
  }
  compose() {
    let context = this.context;
    this.jobQueue = this.queue.map(item => {
      if (typeof item === 'function') {
        if (ValleyModule.isPrototypeOf(item)) {
        // 类
          return async () => {
            let m = new item();
            return m.init(context);
          };
        } else {
        // 函数
          return item.bind({ context });
        }
      } else if (item instanceof Array) {
        // 数组
        return async next => {
          let len = item.length;
          let list = item.map(fn => fn.call({ context }, async () => {
            len --;
            if (len <= 0) {
              await next();
            }
          }));
          await Promise.all(list);
        };
      } else if (item instanceof ValleyModule) {
        // 类实例化
        return m.init(context);
      }
      return emptyFn;
    });
  }
  runQueue(next) {
    // this.queue.forEach((fn,i) => console.log(i, fn.toString()))
    return runItemFn(0, this.jobQueue);
  }
}

export default ValleyModule;
// module.exports = ValleyModule;
