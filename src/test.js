let emptyFn = async next => {
  await next();
};

let asyncRegExp = /^async /;

function runItem(index, queue) {
  let fn = queue[index];
  if (!fn) {
    return;
  }
  return fn(pos => {
    return runItem(index + 1, queue);
  });
}

function runComponent(component, scope) {
  let item;
  if (typeof component === 'function') {
    if (ValleyModule.isPrototypeOf(component)) {
      item = async function(next) {
        let m = new component();
        let res = await m.run(this.context);
        this.context = Object.assign(this.context, res);
        await next();
      };
    } else {
      item = component;
      let funStr = component.toString();
      if (asyncRegExp.test(funStr)) {
        return component;
      } else {
        return async next => {
          await component();
          await next();
        };
      }
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
  constructor() {
    this.jobQueue = [];
    this.names = [];
    this.context = {};
  }
  use(name, component) {
    this.names.push(name);
    this.jobQueue.push(component);
  }
  runComponent(index) {
    if (index >= this.jobQueue.length) {
      return this.context;
    }
    let component = this.jobQueue[index] || emptyFn;
    return this.runComponent(pos => {
      let pIndex = pos || (index + 1);
      return tihs.runComponent(pIndex);
    });
  }
  run(context) {
    return runComponent(0, this.jobQueue);
  }
}

export default ValleyModule;
