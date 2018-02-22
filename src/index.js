require('core-js/fn/array/find-index');
require('core-js/fn/object/assign');

let emptyFn = async next => {
  await next();
};

function runItem(index, queue) {
  let fn = queue[index];
  if (!fn) {
    return;
  }
  return fn(() => {
    return runItem(index + 1, queue);
  });
}

function initComponent(component, scope) {
  let item;
  if (typeof component === 'function') {
    if (ValleyModule.isPrototypeOf(component)) {
      item = async next => {
        let m = new component();
        let res = await m.run(scope.context);
        scope.context = Object.assign(scope.context, res);
        await next();
      };
    } else {
      item = component.bind(scope);
    }
  } else if (component instanceof Array) {
    item = async next => {
      let list = component.map(fn => {
        if (typeof fn === 'function') {
          return fn.call(scope);
        } else if (fn instanceof ValleyModule) {
          return fn.run(scope.context);
        } else {
          return emptyFn.call(scope, next);
        }
      });
      let res = await Promise.all(list);
      scope.context = Object.assign(scope.context, res);
      await next();
    };
  } else if (component instanceof ValleyModule) {
    item = async next => {
      let res = await component.run(scope.context);
      scope.context = Object.assign(scope.context, res);
      await next();
    };
  } else {
    item = emptyFn;
  }
  return item;
}

class ValleyModule {
  constructor(input) {
    input = input || {};

    this.jobQueue = [];
    this.names = [];
    this.context = input.context || {};

    this.prepare && this.prepare();
  }
  throwFn(err) {
    throw new Error(`non-error thrown: ${err}`);
  }
  use(name, component) {
    let item = initComponent(component, this);

    this.names.push(name);
    this.jobQueue.push(item);
  }
  unuse(name) {
    let index = this.findIndex(name);
    this.names.splice(index, 1);
    this.jobQueue.splice(index, 1);
  }
  update(name, component) {
    let index = this.findIndex(name);
    this.jobQueue[index] = initComponent(component, this);
  }
  findIndex(name) {
    return this.names.findIndex(item => item === name);
  }
  getNames() {
    return this.names;
  }
  run(context, tag) {
    let start;
    let end;
    if (typeof tag === 'object' && tag.start) {
      // context = tag;
      // tag = null;
      start = tag.start;
      end = tag.end;
    } else if (typeof tag === 'string') {
      start = tag;
      end = null;
    }

    let startIndex = start ? this.findIndex(start) : 0;
    let endIndex = end ? this.findIndex(end) : null;
    if (startIndex < 0) {
      return Promise.reject(`No [${tag}] tag in queue`);
    }

    if (context) {
      this.context = Object.assign({}, this.context, context);
    }

    // 最外层的封装，queue执行到最后将context作为返回值返回
    let tmpArr;
    if (endIndex) {
      tmpArr = this.jobQueue.slice(startIndex, endIndex);
    } else {
      tmpArr = this.jobQueue.slice(startIndex);
    }
    tmpArr.unshift(async next => {
      await next();
      return this.context;
    });

    return runItem(0, tmpArr);
  }
}

export default ValleyModule;
