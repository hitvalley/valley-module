import ValleyModule from '../src/valley-module';
// const ValleyModule = require('./vm');

class RenderModule extends ValleyModule {
  constructor(input) {
    super(input);
    this.add(async next => {
      let moduleName = this.getModule(this.context.path);
      if (moduleName === input.name) {
        console.log(`render ${input.name}`, Date.now());
      }
      await next();
    });
  }
  getModule(path) {
    return path.replace(/^\/|\/$/g, '');
  }
}

class RouterModule extends ValleyModule {
  constructor(input) {
    super(input);
    let checkRoute = async next => {
      // console.log(this.context);
      this.context.path = process.argv && process.argv[2] || '/index';
      await next();
    };
    this.queue = [checkRoute];
  }
}

let indexM = new RenderModule({ name: 'index' });
let listM = new RenderModule({ name: 'list' });

class MainModule extends ValleyModule {
  constructor(input) {
    super(input);
    let self = this;
    this.queue = [
      async next => {
        console.log('start', Date.now());
        let promise = new Promise(resolve => {
          setTimeout(() => {
            // resolve('prepare');
            self.context.text = 'prepare';
            resolve(self.context.text);
          }, 600);
        });
        let res = await promise;
        await next();
      },
      async next => {
        console.log(self.context.text, Date.now());
        await next();
      },
      RouterModule,
      [indexM, listM]
    ];
  }
}

let mainModule = new MainModule();
mainModule.init().then(res => {
  mainModule.runQueue(1);
})
