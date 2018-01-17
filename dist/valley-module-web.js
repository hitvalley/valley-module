(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ValleyModule = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};









var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var _this = window;

var emptyFn = function () {
  var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return next();

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function emptyFn(_x) {
    return _ref.apply(this, arguments);
  };
}();

function runItem(index, queue) {
  var fn = queue[index];
  if (!fn) {
    return;
  }
  return fn(function () {
    return runItem(index + 1, queue);
  });
}

function initComponent(component, scope) {
  var _this2 = this;

  var item = void 0;
  if (typeof component === 'function') {
    if (ValleyModule$1.isPrototypeOf(component)) {
      item = function () {
        var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(next) {
          var m, res;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  m = new component();
                  _context2.next = 3;
                  return m.run(scope.context);

                case 3:
                  res = _context2.sent;

                  scope.context = Object.assign(scope.context, res);
                  _context2.next = 7;
                  return next();

                case 7:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this2);
        }));

        return function item(_x2) {
          return _ref2.apply(this, arguments);
        };
      }();
    } else {
      item = component.bind(scope);
    }
  } else if (component instanceof Array) {
    item = function () {
      var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(next) {
        var list, res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                list = component.map(function (fn) {
                  if (typeof fn === 'function') {
                    return fn.call(scope);
                  } else if (fn instanceof ValleyModule$1) {
                    return fn.run(scope.context);
                  } else {
                    return emptyFn.call(scope, next);
                  }
                });
                _context3.next = 3;
                return Promise.all(list);

              case 3:
                res = _context3.sent;

                scope.context = Object.assign(scope.context, res);
                _context3.next = 7;
                return next();

              case 7:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this2);
      }));

      return function item(_x3) {
        return _ref3.apply(this, arguments);
      };
    }();
  } else if (component instanceof ValleyModule$1) {
    item = function () {
      var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(next) {
        var res;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return component.run(scope.context);

              case 2:
                res = _context4.sent;

                scope.context = Object.assign(scope.context, res);
                _context4.next = 6;
                return next();

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, _this2);
      }));

      return function item(_x4) {
        return _ref4.apply(this, arguments);
      };
    }();
  } else {
    item = emptyFn;
  }
  return item;
}

var ValleyModule$1 = function () {
  function ValleyModule(input) {
    classCallCheck(this, ValleyModule);

    input = input || {};

    this.jobQueue = [];
    this.names = [];
    this.context = input.context || {};

    this.prepare && this.prepare();
  }

  createClass(ValleyModule, [{
    key: 'throwFn',
    value: function throwFn(err) {
      throw new Error('non-error thrown: ' + err);
    }
  }, {
    key: 'use',
    value: function use(name, component) {
      var item = initComponent(component, this);

      this.names.push(name);
      this.jobQueue.push(item);
    }
  }, {
    key: 'unuse',
    value: function unuse(name) {
      var index = this.findIndex(name);
      this.names.splice(index, 1);
      this.jobQueue.splice(index, 1);
    }
  }, {
    key: 'update',
    value: function update(name, component) {
      var index = this.findIndex(name);
      this.jobQueue[index] = initComponent(component, this);
    }
  }, {
    key: 'findIndex',
    value: function findIndex(name) {
      return this.names.findIndex(function (item) {
        return item === name;
      });
    }
  }, {
    key: 'getNames',
    value: function getNames() {
      return this.names;
    }
  }, {
    key: 'run',
    value: function run(context, tag) {
      var _this3 = this;

      var start = void 0;
      var end = void 0;
      if ((typeof tag === 'undefined' ? 'undefined' : _typeof(tag)) === 'object' && tag.start) {
        // context = tag;
        // tag = null;
        start = tag.start;
        end = tag.end;
      } else if (typeof tag === 'string') {
        start = tag;
        end = null;
      }

      var startIndex = start ? this.findIndex(start) : 0;
      var endIndex = end ? this.findIndex(end) : null;
      if (startIndex < 0) {
        return Promise.reject('No [' + tag + '] tag in queue');
      }

      if (context) {
        this.context = Object.assign({}, this.context, context);
      }

      // 最外层的封装，queue执行到最后将context作为返回值返回
      var tmpArr = void 0;
      if (endIndex) {
        tmpArr = this.jobQueue.slice(startIndex, endIndex);
      } else {
        tmpArr = this.jobQueue.slice(startIndex);
      }
      tmpArr.unshift(function () {
        var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(next) {
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return next();

                case 2:
                  return _context5.abrupt('return', _this3.context);

                case 3:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, _this3);
        }));

        return function (_x5) {
          return _ref5.apply(this, arguments);
        };
      }());

      return runItem(0, tmpArr);
    }
  }]);
  return ValleyModule;
}();

ValleyModule$1.build = function (confList) {
  var ChildModule = function (_ValleyModule) {
    inherits(ChildModule, _ValleyModule);

    function ChildModule() {
      classCallCheck(this, ChildModule);
      return possibleConstructorReturn(this, (ChildModule.__proto__ || Object.getPrototypeOf(ChildModule)).apply(this, arguments));
    }

    createClass(ChildModule, [{
      key: 'prepare',
      value: function prepare() {
        var _this2 = this;

        confList.forEach(function (item) {
          var name = item.name;
          var component = item.component;
          if (name && fn) {
            _this2.use(name, component);
          }
        });
      }
    }]);
    return ChildModule;
  }(ValleyModule$1);

  return ChildModule;
};

return ValleyModule$1;

})));
