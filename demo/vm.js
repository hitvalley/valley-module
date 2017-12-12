'use strict';

let emptyFn = () => {};

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
    let self = this;
    this.context = context || {};
    this.queue.unshift(async next => {
      await next();
      return self.context;
    });
    this.jobQueue = this.compose();
    // console.log(this.jobQueue)
    // this.jobQueue.forEach(fn => console.log(fn.toString()))
    return this.runQueue();
  }
  add(fn) {
    this.queue.push(fn);
  }
  compose(queue, scope) {
    let self = scope || this;
    return (queue || this.queue).map(item => {
      if (typeof item === 'function') {
        if (ValleyModule.isPrototypeOf(item)) {
        // 类
          return async next => {
            let m = new item();
            let res = await m.init(self.context);
            self.context = Object.assign(self.context, res);
            await next();
          };
        } else {
        // 函数
          // return async next => {
          return item.bind(self);
            // await next();
          // };
        }
      } else if (item instanceof Array) {
        // 数组
        return async next => {
          let list = item.map(fn => {
            if (typeof fn === 'function') {
              return fn.call(self);
            } else if (fn instanceof ValleyModule) {
              return fn.init(self.context);
            }
          });
          let res = await Promise.all(list);
          self.context = Object.assign(self.context, res);
          await next();
        };
      } else if (item instanceof ValleyModule) {
        // 类实例化
        return async next => {
          let res = await m.init(self.context);
          self.context = Object.assign(self.context, res);
          await next();
        };
      }
      return emptyFn;
    });
  }
  runItem(index) {
    let fn = this.jobQueue[index];
    let self = this;
    if (!fn) {
      return;
    }
    return fn(() => {
      return self.runItem(index + 1);
    });
  }
  runQueue(next) {
    // this.queue.forEach((fn,i) => console.log(i, fn.toString()))
    return this.runItem(0);
  }
}


// module.exports = ValleyModule;

module.exports = ValleyModule;
