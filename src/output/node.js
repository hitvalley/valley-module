import ValleyModule from '../index';

import http from 'http';
import https from 'https';
// import http2 from 'http2';
import fs from 'fs';

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
    let server;
    return new Promise((resolve, reject) => {
      switch(type) {
      case 'https':
        server = https.createServer({
          key: fs.readFileSync(options.key),
          cert: fs.readFileSync(options.cert),
        }, (req, res) => {
          self.run({
            req,
            res
          });
        });
        break;
      case 'http':
      default:
        server = http.createServer((req, res) => {
          self.run({
            req,
            res
          });
        });
      }
      server.listen({
        port,
        host
      }, function() {
        resolve(arguments);
      });
    });
  }
}

export default ServerModule;
