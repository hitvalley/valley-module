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
  })
  // console.log(this.context.html)
});

test('normal', async () => {
  let res = await main.run();
  expect(res.html).toEqual('my name is valley-module');
});
