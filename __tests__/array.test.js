import ValleyModule from '../src/index';

let main = new ValleyModule();

function getData() {
  let timelen = Math.ceil(Math.random() * 10);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({name: 'valley-module'});
    }, timelen);
  });
}

function getTpl() {
  let timelen = Math.ceil(Math.random() * 10);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('my name is ${name}');
    }, timelen);
  });
}

main.use('first', async next => {
  await next(1);
})

main.use('prepare', [
  async next => {
    let data = await getData();
    return data;
  },
  async next => {
    let tpl = await getTpl();
    return tpl;
  }
]);

main.use('render', async function(next) {
  let data = this.context[0];
  let tpl = this.context[1];
  this.context.html = tpl.replace(/\$\{([^}]+)\}/g, ($0, $1) => {
    return data[$1];
  });
});

test('array function', async () => {
  let res = await main.run();
  expect(res.html).toEqual('my name is valley-module');
});

test('array module', async () => {
  let id = 0;
  let main = new ValleyModule();
  let source1 = new ValleyModule();
  let source2 = new ValleyModule();
  source1.use('info', async function() {
    id ++;
  });
  source2.use('info', async function() {
    id ++;
  });
  main.use('info', [source1, source2]);
  let res = await main.run();
  expect(id).toEqual(2);
});

test('array empty', async () => {
  let main = new ValleyModule();
  main.use('info', [1, 2]);
  let res = await main.run();
  expect(res).toEqual({});
});
