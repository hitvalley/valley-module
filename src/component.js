const emptyFn = async next => {
  await next();
};

const runItem = (pos, index, queue) => {
  pos = pos || 'next';
  let fn = queue[index];
  if (!fn) {
    return;
  }
  return fn(pos => {
    return runItem(pos, index, queue);
  })
}

const initComponent = (component, scope) => {
  let item;
  if (typeof component === 'function') {
    if (ValleyModule.isPrototypeOf(component)) {
      // ValleyModule 子类

    } else {
      // 基本组件
      item = component.bind(scope);
    }
  } else if (component instanceof Array) {
    let list = component.map(fn => initComponent(fn));
    item = async next => {
    };
  } else if (component instanceof ValleyModule) {

  } else {
    item = emptyFn;
  }
  return item;
};

default export initComponent;