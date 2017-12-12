import ValleyModule from '../src/valley-module';
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

class RenderModule extends ValleyModule {
  constructor(input) {
    super(input);
    this.add(async next => {
      let moduleName = this.getModule(this.context.path);
      if (moduleName === input.name) {
        this.context.tpl = `${input.name}Tpl`;
        this.context.data = `${input.name}Data`;
        console.log(`begin render ${input.name}`, Date.now());
        await next();
      }
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

class HTMLModule extends ValleyModule {
  constructor(input) {
    super(input);
    this.queue = [
      async next => {
        console.log(`render html ${this.context.path}`);
        await next();
      }
    ]
  }
}

class MainModule extends ValleyModule {
  constructor(input) {
    super(input);
    let self = this;
    this.queue = [
      async next => {
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
      },
      RouterModule,
      [indexM, listM],
      [
        async next => {
          let res = await getTpl(this.context.tpl);
          console.log(res);
          // await next();
        },
        async next => {
          let res = await getData(this.context.data);
          console.log(res);
          // await next();
        }
      ],
      HTMLModule
    ];
  }
}

let mainModule = new MainModule();
mainModule.init().then(res => {
  // console.log(' >> ')
  // mainModule.runQueue(4);
})
