// import ValleyModule from '../src/valley-module';
// const ValleyModule = require('./vm');

function getTpl(name) {
  let len = Math.floor(Math.random() * 10) * 100;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`tpl: ${name} ${len}`);
    }, len)
  });
}

function getData(data) {
  let len = Math.floor(Math.random() * 10) * 100;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`data ${data} ${len}`);
    }, len);
  });
}

class RouterModule extends ValleyModule {
  prepare() {
    let indexM = new RenderModule({ name: 'index' });
    let listM = new RenderModule({ name: 'list' });
    this.add('route', async next => {
      this.context.path = (location.hash || '#').substring(1) || 'index'
      let path = this.context.path.replace(/^\/|\/$/g, '');
      console.log(path)
      switch (path) {
      case 'index':
        indexM.init(this.context);
        break;
      case 'list':
        listM.init(this.context);
        break;
      }
      await next();
    });
  }
}

class RenderModule extends ValleyModule {
  constructor(input) {
    super(input);
    this.name = input.name;
  }
  prepare() {
    this.add('render', async next => {
      let moduleName = this.getModule(this.context.path);
      this.context.tpl = `${this.name}Tpl`;
      this.context.data = `${this.name}Data`;
      await next();
      console.log(`begin render ${this.name}`, Date.now());
    });
    this.add('prepare', [
      async next => {
        let res = await getTpl(this.context.tpl);
        console.log(res);
      },
      async next => {
        let res = await getData(this.context.data);
        console.log(res);
      }
    ]);
  }
  getModule(path) {
    return path.replace(/^\/|\/$/g, '');
  }
}


// class HTMLModule extends ValleyModule {
  // constructor(input) {
    // super(input);
    // this.queue = [
      // async next => {
        // console.log(`render html ${this.context.path}`);
        // await next();
      // }
    // ]
  // }
// }

class MainModule extends ValleyModule {
  constructor(input) {
    super(input)
    this.name = 'main'
  }
  prepare() {
    let self = this;
    this.add('start', async next => {
      console.log('start', Date.now());
      console.time('main')
      let promise = new Promise(resolve => {
        setTimeout(() => {
          // resolve('prepare');
          self.context.text = 'prepare';
          resolve(self.context.text);
        }, 600);
      });
      let res = await promise;
      await next();
      console.timeEnd('main')
    });
    this.add('router', RouterModule);
  }
}

let mainModule = new MainModule();
mainModule.init().then(res => {
  // console.log(' >> ')
  // mainModule.runQueue(4);
})
