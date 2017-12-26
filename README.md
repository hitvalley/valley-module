# 组件管理 (更新中...)

## 简述

### 目的

提供接口，接口规定了模块中组件的执行和通讯规则

### 概念定义

* 组件：程序运行的一个步骤
* 模块：一系列组件顺序运行的集合

> 每一个模块包含若干组件，组件在模块的组件队列中，该插件保证队列顺序执行。顺序执行类似于 Koa2，后面的组件会在前面组件调用 next 函数时执行。

## 运行

### run demo

```
## nodejs 版本 >8.0
npm i
npm run demo
```
### run server

```
npm run demo:server

## 访问：http://localhost:3001
```

## 组件

### 1. 最小的组件
> 异步函数

```
async function fn(next) {
  ...
  next(); // 下一个组件的执行位置
  ...
};

mainModule.use('fn', fn);
```

**由于使用this.context, 组件尽量不要使用箭头函数，下同**

### 2. 并发组件
> 数组

设定数组中的组件同时执行，都执行完成之后，执行数组后面的组件

数组组件包含：

* 异步函数
* 模块的实例化

```
let middles = [
  async function(next) {
    ...
  },
  async function(next) {
    ...
  }
];

mainModule.add('middles', middles);
```

### 3. 模块组件
> 模块或者模块的实例

#### 3.1 模块组件: 引入 ValleyModule 的子类，执行完子类的 init 方法后，执行后面的组件

```
class DemoModule extends ValleyModule {
  ...
}

mainModule.add('demo', DemoModule);
```

#### 3.2 模块实例组件: 引入 ValleyModule 或 ValleyModule子类 的实例化，执行完 init 方法后，执行后面的组件

```
class DemoModule extends ValleyModule {
  ...
}

let demoModule = new DemoModule();
mainModule.add('demo', demoModule);
```

### 4. 选择组件的实现
> 用函数和模块混合实现

可以引入一个模块，来实现组件选择

```
class DemoModule1 extends ValleyModule {
  ...
}

class DemoModule2 extends ValleyModule {
  ...
}

mainModule.add('check', async function(next) {
  let demo1 = new DemoModule1();
  let demo2 = new DemoModule2();
  if (this.context.type) {
    await demo1.init();
  } else {
    await demo2.init();
  }
  await next();
});
```

## 模块执行

```javascript
mainModule.run(tag, context);
```

参数
* tag
  * 为起始执行的组件名称
  * run方法会顺序执行 ${tag} 组件之后的所有组件
* context
  * context 为组件运行的变量对象；
  * 组件处理的公共变量需要存储在 context 上面；
  * context 可以在模块类构造函数中初始化，设定为this.context，即当前模块类的变量；
  * context 输入会执行 Object.assign({}, this.context, context)，重新赋值给 this.context

## 方法

* prepare // 帮助在构造函数中准备模块的组件
* use // 增加一个组件，需要确定组件名称和组件内容
* unuse // 根据组件名，删除一个组件
* run // 顺序执行组件，可以从特定位置执行

## 可用组件

* ValleyTpl
  * 功能：文字模板组件
  * https://github.com/hitvalley/valleytpl/blob/master/README.md#%E6%94%AF%E6%8C%81valleymodule
* ValleyServer
  * 功能：node server 工具
  * https://github.com/hitvalley/valley-server

## demo

https://github.com/hitvalley/valley_module_demo
