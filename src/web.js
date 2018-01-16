import ValleyModule from './index';

ValleyModule.build = (confList) => {
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

export default ValleyModule;
