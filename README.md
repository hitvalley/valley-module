# 组件管理 (更新中...)

每一个模块包含若干组件，组件在一个队列中，使组件队列顺序执行。

## run demo

```
npm i
npm run demo
```

## 组件

### 函数组件

使用异步函数

```
async () => {
  ...
  next(); // 下一个组件的执行位置
  ...
};
```

### 数组组件

设定数组中的组件同时执行，都执行完成之后，执行数组后面的组件

  数组组件包含：
    * 异步函数
    * 模块的实例化

```
[
  async () => {
    ...
  },
  async () => {
    ...
  }
]
```

### 模块子类

引入 ValleyModule 的子类，执行完子类的 init 方法后，执行后面的组件

```
class RenderModule extends ValleyModule {
  ...
}
```

### 模块的实例化

引入 ValleyModule 或 ValleyModule子类 的实例化，执行完 init 方法后，执行后面的组件

```
class r = new RenderModule();
r.init(xxx);
```

### 选择组件实现

可以引入一个模块，来实现组件选择

```
class RouterModule extends ValleyModule {
  prepare() {
    const r1 = new Render();
    const r2 = new Render();
    this.add('route', async next => {
      if (check r1) {
        await r1.init();
      } else {
        await r2.init();
      }
      await next();
    });
  }
}
```

## 方法

* prepare // 准备好模块中组件的
* add // 增加一个组件
* init // 初始化模块，并顺序化执行组件
* runQueue // 顺序执行组件，可以从特定位置执行
