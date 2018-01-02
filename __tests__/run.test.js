import ValleyModule from '../src/index';

class MainModule extends ValleyModule {
  prepare() {
    this.use('tpl', async next => {
      this.context.tpl = 'module\'s author is ${author}';
      await next();
    });
    this.use('data', async next => {
      this.context.data = {
        author: 'hitvalley'
      };
      await next();
    });
    this.use('render', async next => {
      let html;
      let tpl = this.context.tpl;
      let data = this.context.data;
      if (this.context.tpl) {
        html = tpl.replace('${author}', data.author);
      } else {
        html = `my name is ${data.author}`;
      }
      this.context.html = html;
      await next();
    });
  }
}

test('test run total', async () => {
  let mainModule = new MainModule();
  let res = await mainModule.run();
  expect(res.html).toBe('module\'s author is hitvalley');
});

test('test run tag', async () => {
  let mainModule = new MainModule();
  let res = await mainModule.run('data');
  expect(res.html).toBe('my name is hitvalley');
});

test('test run with no tag', async () => {
  let mainModule = new MainModule();
  let res = await mainModule.run('no-tag').catch(err => err);
  expect(res).toBe('No [no-tag] tag in queue');
});

test('test unuse', async () => {
  let mainModule = new MainModule();
  mainModule.unuse('tpl');
  let res = await mainModule.run();
  expect(res.html).toBe('my name is hitvalley');
});
