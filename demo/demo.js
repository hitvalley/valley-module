// import ValleyModule from '../src/valley-module';
const ValleyModule = require('../src/valley-module');

/// for demo
function getTpl() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('tpl');
    }, 600)
  });
}
function getData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('data');
    }, 1200)
  });
}
/// end


let queue = [];

queue.push(async next => {
  console.time('render');
  await next();
  console.timeEnd('render');
  return true;
})

queue.push(async next => {
  let res = await getTpl();
  console.log(res);
  await next();
});

queue.push(async next => {
  let res = await getData();
  console.log(res);
  await next();
});

class PrepareModule extends ValleyModule {
  constructor(input) {
    super(input);
    let prepare = async next => {
      console.log('start prepare', Date.now());
      let pjob = new Promise(resolve => {
        setTimeout(() => {
          resolve('end prepare');
        }, 1000);
      });
      let res = await pjob;
      console.log(res, Date.now());
      await next();
    }
    this.queue = [prepare];
  }
}

queue.push(async next => {
  let pm = new PrepareModule();
  await pm.runQueue();
  await next();
})

queue.push(next => {
  console.log('html');
});

class RenderModule extends ValleyModule {
  constructor(input) {
    super(input);
    this.queue = queue;
    // console.log(this.queue[0].toString())
  }
}


let rm = new RenderModule();
rm.runQueue();
