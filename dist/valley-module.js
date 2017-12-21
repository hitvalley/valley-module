var ValleyModule = (function () {
'use strict';

let emptyFn = () => {};

function runItem(index, queue) {
  let fn = queue[index];
  if (!fn) {
    return;
  }
  return fn(() => {
    return runItem(index + 1, queue);
  });
}

class ValleyModule {
  constructor(input) {
    input = input || {};
    this.names = [];
    this.jobQueue = [];
    this.indexObj = {};

    this.context = {};
    this.prepare && this.prepare();
  }
  // init(context) {
    // this.context = context || this.context || {};
    // let res = this.run();
    // return res;
  // }
  use(name, component) {
    let self = this;
    let item;

    this.names.push(name);

    if (typeof component === 'function') {
      if (ValleyModule.isPrototypeOf(component)) {
        item = async next => {
          let m = new component();
          let res = await m.run(self.context);
          self.context = Object.assign(self.context, res);
          await next();
        };
      } else {
        item = component.bind(self);
      }
    } else if (component instanceof Array) {
      item = async next => {
        let list = component.map(fn => {
          if (typeof fn === 'function') {
            return fn.call(self);
          } else if (fn instanceof ValleyModule) {
            return fn.run(self.context);
          }
        });
        let res = await Promise.all(list);
        self.context = Object.assign(self.context, res);
        await next();
      };
    } else if (component instanceof ValleyModule) {
      item = async next => {
        let res = await component.run(self.context);
        self.context = Object.assign(self.context, res);
        await next();
      };
    } else {
      item = emptyFn;
    }

    this.jobQueue.push(item);
  }
  unuse(name) {
    let index = this.findIndex(name);
    this.names.slice(index, 1);
    this.jobQueue.slice(index, 1);
  }
  findIndex(name) {
    return this.names.findIndex(item => item === name);
  }
  getNames() {
    return this.names;
  }
  run(tag, context) {
    if (typeof tag === 'object') {
      context = tag;
      tag = null;
    }

    let startIndex = tag ? this.findIndex(tag) : 0;
    if (startIndex < 0) {
      return Promise.reject(`No [${tag}] in queue`);
    }

    if (context) {
      this.context = Object.assign({}, this.context, context);
    }

    // 最外层的封装，queue执行到最后将context作为返回值返回
    let tmpArr = this.jobQueue.slice(startIndex);
    tmpArr.unshift(async next => {
      let res = await next().catch(err => {
        this.context = err;
      });
      return this.context;
    });

    return runItem(startIndex, tmpArr);
  }
}

return ValleyModule;

}());
