import ValleyModule from '../src/index';

let main = new ValleyModule();

main.use('normal', async function(next) {
  this.context = {
    data: 1
  };
});

test('normal', async () => {
  let res = await main.run();
  expect(res).toEqual({data: 1});
});
