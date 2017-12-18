let emptyFn = () => {};

class ValleyModule {
  constructor(input) {
    input = input || {};
    // this.queue = input.queue || [];
    this.names = [];
    this.jobQueue = [];
    this.indexObj = {};

    this.use('__begin', async next => {
      let res = await next().catch(err => {
        console.log(err)
        this.context = err;
      });
      return this.context;
    });

    this.prepare && this.prepare();
  }
  init(context) {
    let self = this;
    // let name = this.name;
    this.context = context || this.context || {};
    let res = this.run();
    return res;
  }
  use(name, component) {
    let self = this;
    let item;

    // this.queue.push({
      // name,
      // component
    // });
    this.names.push(name);

    if (typeof component === 'function') {
      if (ValleyModule.isPrototypeOf(component)) {
        item = async next => {
          let m = new component();
          let res = await m.init(self.context);
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
            return fn.init(self.context);
          }
        });
        let res = await Promise.all(list);
        self.context = Object.assign(self.context, res);
        await next();
      };
    } else if (component instanceof ValleyModule) {
      item = async next => {
        let res = await component.init(self.context);
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
  run(tag) {
    let startIndex = this.findIndex(tag || '__begin');
    if (startIndex < 0) {
      return Promise.reject(`No [${tag}] item in queue`);
    }
    return this.runItem(startIndex);
  }
}

export default ValleyModule;
