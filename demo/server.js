const Server = require('./valley-module-server');
// import path from 'path';

const server = new Server();

server.use('test', async function(next) {
  this.context.text('hello valley', {
    'Content-Type': 'text/plain'
  });
  await next();
})

server.listen({
  type: 'http',
  port: 3001,
  // key: path.join(__dirname, 'cert', 'hitvalley-key.pem'),
  // cert: path.join(__dirname, 'cert', 'hitvalley-cert.pem')
}).then(res => console.log('http://localhost:3001'));
