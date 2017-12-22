const Server = require('./valley-module-server');
// import path from 'path';

const server = new Server();

server.use('test', async function(next) {
  // console.log(server.context)
  let res = this.context.res;
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello valley\n');
  await next();
})

server.listen({
  type: 'http',
  port: 3001,
  // key: path.join(__dirname, 'cert', 'hitvalley-key.pem'),
  // cert: path.join(__dirname, 'cert', 'hitvalley-cert.pem')
}).then(res => console.log('http://localhost:3001'));
