import ValleyModule from '../src/index';

class DemoModule extends ValleyModule {
  prepare() {
    this.use('test', async next => {
      this.context.name = 'demo';
      await next();
    });
  }
}

let tplModule = new ValleyModule();
tplModule.use('tpl', async function(next) {
  this.context.tpl = 'module name is ${name}';
});

let main = new ValleyModule();
main.use('demo', DemoModule);
main.use('tpl', tplModule);
main.use('print', async function(next) {
  let tpl = this.context.tpl;
  let name = this.context.name;
  this.context.info = tpl.replace('${name}', name);
  // this.context.info = `module name is ${this.context.name}`;
});

test('module test', async () => {
  let res = await main.run();
  expect(res.info).toEqual('module name is demo');
});

