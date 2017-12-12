import ValleyModule from '../src/valley-module';

class RenderModule extends ValleyModule {
  constructor(input) {
    super(input);
    this.add(async next => {
      let moduleName = this.getModule(this.context.path);
      if (moduleName === input.name) {
        console.log(`render ${input.name}`);
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
    this.queue = [
      RouterModule,
      [indexM, listM],
    ];
  }
}

let mainModule = new MainModule();
mainModule.init();
