# 组件管理 (更新中...)

## 简述

概念定义

* 组件：程序运行的一个步骤
* 模块：一系列组件顺序运行的集合

> 每一个模块包含若干组件，组件在模块的组件队列中，该插件保证队列顺序执行。顺序执行类似于 Koa2，后面的组件会在前面组件调用 next 函数时执行。

## run demo

```
npm i
npm run demo
```

## 组件

### 1. 最小的组件
> 异步函数

```
let fn = async () => {
  ...
  next(); // 下一个组件的执行位置
  ...
};

mainModule.use('fn', fn);
```

### 2. 并发组件
> 数组

设定数组中的组件同时执行，都执行完成之后，执行数组后面的组件

  数组组件包含：
    * 异步函数
    * 模块的实例化

```
let middles = [
  async next => {
    ...
  },
  async next => {
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

mainModule.add('check', async next => {
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

### 模块完整执行
```javascript 
mainModule.init(); // 包含prepare工作

// 或者

mainModule.run();
```
### 模块部分执行

```jvascript
let name = '...';
mainModule.run(name); // 从组件名为 {name} 的组件开始，向后执行
```

## 方法

* prepare // 准备好模块中组件的
* use // 增加一个组件
* init // 初始化模块，并顺序化执行组件
* run // 顺序执行组件，可以从特定位置执行
