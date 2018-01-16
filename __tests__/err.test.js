import ValleyModule from '../src/index';

class MainModule extends ValleyModule {
  prepare() {
    this.use('err', async next => {
      this.throwFn(new Error('test error'));
    });
  }
}

test('error', async () => {
  let main = new MainModule();
  try {
    let res = await main.run();
  } catch(e) {
    expect(e.message).toBe('non-error thrown: Error: test error');
  }

});
