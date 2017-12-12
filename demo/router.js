import ValleyModule from '../src/valley-module';

class RouterModule extends ValleyModule {
  constructor(input) {
    super(input);
    let prepare = async next => {
      console.log('start prepare', Date.now());
      let pjob = new Promise(resolve => {
        setTimeout(() => {
          resolve('end prepare');
        }, 1000);
      });
      let res = await pjob;
      console.log(res, Date.now());
      await next();
    }
    let path = input.path || '';
    let modules = input.modules || {};
    let checkRoute = async next => {
      return modules[path];
    }
    this.queue = [checkRoute];
  }
}
