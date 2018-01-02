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

test('test getNames', async () => {
  let mainModule = new MainModule();
  let names = mainModule.getNames();
  expect(names).toContain('tpl');
  expect(names).toContain('data');
  expect(names).toContain('render');
});

test('test findIndex', async () => {
  let mainModule = new MainModule();
  let names = mainModule.getNames();
  names.forEach((name, index) => {
    expect(mainModule.findIndex(name)).toEqual(index);
  });
});

