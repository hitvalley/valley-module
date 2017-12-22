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
    this.name = 'router';
    let indexM = new RenderModule({ name: 'index' });
    let listM = new RenderModule({ name: 'list' });
    this.use('route', async function(next) {
      if (typeof process === 'undefined') {
        this.context.path = (location.hash || '#').substr(1) || '/index';
      } else {
        this.context.path = process.argv && process.argv[2] || '/index';
      }
      let path = this.context.path.replace(/^\/|\/$/g, '');
      console.log('path:', path)
      switch (path) {
      case 'index':
        await indexM.run(this.context);
        break;
      case 'list':
        await listM.run(this.context);
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
    this.use('render', async function(next) {
      let moduleName = this.getModule(this.context.path);
      this.context.tpl = `${this.name}Tpl`;
      this.context.data = `${this.name}Data`;
      await next();
      console.log(`begin render ${this.name}`, Date.now());
    });
    this.use('prepare', [
      async function(next) {
        let res = await getTpl(this.context.tpl);
        console.log(res);
      },
      async function(next) {
        let res = await getData(this.context.data);
        console.log(res);
      }
    ]);
  }
  getModule(path) {
    return path.replace(/^\/|\/$/g, '');
  }
}


class MainModule extends ValleyModule {
  prepare() {
    this.name = 'main'
    this.use('start', async function(next) {
      console.log('start', Date.now());
      console.time('main')
      let promise = new Promise(resolve => {
        setTimeout(() => {
          // resolve('prepare');
          this.context.text = 'prepare';
          resolve(this.context.text);
        }, 600);
      });
      let res = await promise;
      await next();
      console.timeEnd('main')
    });
    this.use('router', RouterModule);
  }
}

let mainModule = new MainModule();
mainModule.run().then(res => {
  // console.log(res)
  // mainModule.runQueue(4);
  location.hash = '#list';
  console.group('twice');
  mainModule.run('router').then(res => console.groupEnd());
});
