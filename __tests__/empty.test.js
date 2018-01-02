import ValleyModule from '../src/index';

let mainModule = new ValleyModule();

test('test empty components', async () => {
  mainModule.use('empty', null);
  let res = await mainModule.run();
  // console.log(res)
  expect(res).toEqual({})
})
