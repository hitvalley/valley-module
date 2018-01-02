import ValleyModule from '../src/index';

let main = new ValleyModule();

main.use('normal', async function(next) {
  this.context = {
    data: 1
  };
  await next();
});

main.use('last', async function(next) {
  this.context = {
    data: 2
  };
  await next();
});

test('normal', async () => {
  let res = await main.run();
  expect({data: 2}).toEqual(res);
});

test('jobQueue', async () => {
});
