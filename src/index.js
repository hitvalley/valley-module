import ValleyModule from './valley-module';

function Valley(name, input) {
  const VModule = ValleyModule.get(name);
  let vModule = new VModule(input);
  return vModule;
}

export default Valley;
