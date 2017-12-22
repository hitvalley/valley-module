const Server = require('./valley-module-server');

const server = new Server();

server.use('test', async function(next) {
  // console.log(server.context)
  let res = this.context.res;
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello valley\n');
  await next();
})

server.listen({
  port: 3001
}).then(res => console.log('http://localhost:3001'));
