import ValleyModule from './index';

function buildModule(confList) {
  class ChildModule extends ValleyModule {
    prepare() {
      confList.forEach(item => {
        let name = item.name;
        let component = item.component;
        if (name && fn) {
          this.use(name, component);
        }
      });
    }
  }
  return ChildModule;
}

export default buildModule;
