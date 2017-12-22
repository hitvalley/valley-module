import ValleyModule from '../index';

import http from 'http';

class ServerModule extends ValleyModule {
  constructor(input) {
    super(input);
  }
  listen(options) {
    options = options || {};
    let type = options.type || 'http';
    let port = options.port;
    let host = options.host || '0.0.0.0';
    let self = this;
    return new Promise((resolve, reject) => {
      switch(type) {
      case 'http':
      default:
        const server = http.createServer((req, res) => {
          self.run({
            req,
            res
          });
        });
        server.listen({
          port,
          host
        }, () => {
          resolve(arguments);
        });
      }
    });
  }
}

export default ServerModule;
