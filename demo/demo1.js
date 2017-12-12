import ValleyModule from '../src/valley-module';
// const ValleyModule = require('../src/valley-module');

/// for demo
function getTpl() {
  let len = Math.floor(Math.random() * 10) * 100;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`tpl ${len}`);
    }, len)
  });
}
function getData() {
  let len = Math.floor(Math.random() * 10) * 100;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`data ${len}`);
    }, len);
  });
}
/// end


let queue = [];
let start = Date.now();
let end = Date.now();

queue.push(async next => {
  console.log('begin', start);
  console.time('render');
  await next();
  console.timeEnd('render');
  return true;
})

queue.push([
  async next => {
    let res = await getTpl();
    console.log(res);
    await next();
  },
  async next => {
    let res = await getData();
    console.log(res);
    await next();
  }
]);
// queue.push([
  // getData().then(res => {
    // console.log(res);
    // return res;
  // }),
  // getTpl().then(res => {
    // console.log(res);
    // return res;
  // })
// ])

class PrepareModule extends ValleyModule {
  constructor(input) {
    super(input);
    let prepare = async next => {
      end = Date.now();
      console.log('start prepare', end - start, end);
      start = end;
      let pjob = new Promise(resolve => {
        setTimeout(() => {
          resolve('end prepare');
        }, 1000);
      });
      let res = await pjob;
      end = Date.now();
      console.log(res, end - start, end);
      await next();
    }
    this.queue = [prepare];
  }
}

// queue.push(async next => {
  // let pm = new PrepareModule();
  // await pm.runQueue();
  // await next();
// })
queue.push(PrepareModule);

queue.push(next => {
  console.log('html');
});

class RenderModule extends ValleyModule {
  constructor(input) {
    super(input);
    // this.queue = queue;
    // console.log(this.queue[0].toString())
  }
}


let rm = new RenderModule({ queue });
rm.init();
