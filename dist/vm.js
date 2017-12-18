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
    this.prepare && this.prepare();
  }
  init(context) {
    let self = this;
    let name = this.name;
    this.context = context || {};
    this.queue.unshift({
      name: '__begin',
      item: async next => {
        await next();
        return self.context;
      }
    });
    this.indexObj = {};
    this.compose();
    let res = this.runQueue();
    return res;
  }
  findIndex(name) {
    return this.indexObj[name];
  }
  add(name, item) {
    this.queue.push({
      name,
      item
    });
  }
  compose() {
    let self = this;
    this.jobQueue = this.queue.map((item, index) => {
      self.indexObj[item.name] = index;
      item = item.item;
      if (typeof item === 'function') {
        if (ValleyModule.isPrototypeOf(item)) {
        // 类
          return async next => {
            let m = new item();
            let res = await m.init(self.context);
            // console.log(m.name, res)
            self.context = Object.assign(self.context, res);
            await next();
          };
        } else {
        // 函数
          return item.bind(self);
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
  runQueue(start, context) {
    // this.queue.forEach((fn,i) => console.log(i, fn.toString()))
    let startIndex = this.findIndex(start || '__begin');
    return this.runItem(startIndex);
  }
}


// module.exports = ValleyModule;

module.exports = ValleyModule;
