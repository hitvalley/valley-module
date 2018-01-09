import ValleyModule from '../src/index';

let date = new Date();

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
    this.use('tmp', async next => {
      this.context.tmp = this.context.data.author + ' - ' + date;
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
      this.context.tmp = html;
      this.context.html = html;
      await next();
    });
  }
}

test('test update', async () => {
  let mainModule = new MainModule();
  mainModule.update('data', async function(next) {
    this.context.data = {
      author: 'gty'
    };
    await next();
  });
  let res = await mainModule.run();
  expect(res.html).toBe("module's author is gty");
});

test('test read: getNames', async () => {
  let mainModule = new MainModule();
  let names = mainModule.getNames();
  expect(names).toContain('tpl');
  expect(names).toContain('data');
  expect(names).toContain('render');
});

test('test read: findIndex', async () => {
  let mainModule = new MainModule();
  let names = mainModule.getNames();
  names.forEach((name, index) => {
    expect(mainModule.findIndex(name)).toEqual(index);
  });
});

test('test delete: unuse', async () => {
  let mainModule = new MainModule();
  mainModule.unuse('tpl');
  let res = await mainModule.run();
  expect(res.html).toBe('my name is hitvalley');
});

