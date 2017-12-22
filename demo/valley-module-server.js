'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var http = _interopDefault(require('http'));
var https = _interopDefault(require('https'));
var fs = _interopDefault(require('fs'));

let emptyFn = () => {};

function runItem(index, queue) {
  let fn = queue[index];
  if (!fn) {
    return;
  }
  return fn(() => {
    return runItem(index + 1, queue);
  });
}

class ValleyModule {
  constructor(input) {
    input = input || {};

    this.jobQueue = input.jobQueue || [];
    this.names = this.jobQueue.map(item => item.name) || [];
    this.context = input.context || {};

    this.prepare && this.prepare();
  }
  use(name, component) {
    let item;

    this.names.push(name);

    if (typeof component === 'function') {
      if (ValleyModule.isPrototypeOf(component)) {
        item = async next => {
          let m = new component();
          let res = await m.run(this.context);
          this.context = Object.assign(this.context, res);
          await next();
        };
      } else {
        item = component.bind(this);
      }
    } else if (component instanceof Array) {
      item = async next => {
        let list = component.map(fn => {
          if (typeof fn === 'function') {
            return fn.call(this);
          } else if (fn instanceof ValleyModule) {
            return fn.run(this.context);
          }
        });
        let res = await Promise.all(list);
        this.context = Object.assign(this.context, res);
        await next();
      };
    } else if (component instanceof ValleyModule) {
      item = async next => {
        let res = await component.run(this.context);
        this.context = Object.assign(this.context, res);
        await next();
      };
    } else {
      item = emptyFn;
    }

    this.jobQueue.push(item);
  }
  unuse(name) {
    let index = this.findIndex(name);
    this.names.slice(index, 1);
    this.jobQueue.slice(index, 1);
  }
  findIndex(name) {
    return this.names.findIndex(item => item === name);
  }
  getNames() {
    return this.names;
  }
  run(tag, context) {
    if (typeof tag === 'object') {
      context = tag;
      tag = null;
    }

    let startIndex = tag ? this.findIndex(tag) : 0;
    if (startIndex < 0) {
      return Promise.reject(`No [${tag}] tag in queue`);
    }

    if (context) {
      this.context = Object.assign({}, this.context, context);
    }

    // 最外层的封装，queue执行到最后将context作为返回值返回
    let tmpArr = this.jobQueue.slice(startIndex);
    tmpArr.unshift(async next => {
      await next();
      return this.context;
    });

    return runItem(startIndex, tmpArr);
  }
}

// import http2 from 'http2';
class ServerModule extends ValleyModule {
  constructor(input) {
    super(input);
  }
  prepare() {
    this.use('prepare', async next => {
      this.context.text = async (text, headers) => {
        let res = this.context.res;
        Object.keys(headers || {}).forEach(key => {
          res.setHeader(key, headers[key]);
        });
        res.end(`${text}\n`);
      };
      this.context.json = async (data, headers) => {
        let res = this.context.res;
        Object.keys(headers || {}).forEach(key => {
          res.setHeader(key, headers[key]);
        });
        let text = JSON.stringify(data);
        res.end(`${text}\n`);
      };
      await next();
    });
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

module.exports = ServerModule;
