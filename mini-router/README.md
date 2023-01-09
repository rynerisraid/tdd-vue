# mini-router

vue-router 深度与vue集成
官方的介绍：构建单页应用，页面不刷新，但是内容也能切换

## 实现单页SPA，有以下两种

* h5-history 改变URL的时候不会发生页面的刷新
* hash 在URL后面加#号

## 根据URL显示对应的组件

* 路由和组件映射关系
* router-view 告诉我们在哪里渲染组件

## vue-router

```shell
yarn create vite
```

## 思路

1)定义一个插件作为载体
2)实现两个组件 router-view 和 router-link
3)实现创建路由实例的createRouter()
4)实现创建执行模式的createWebHashHistory

## 创建插件

整个vue-router的载体，起始于
createRouter
返回对象，需要实现install方法
1.注册两个组件 router-link  router-view
2.注册 `$router` 和 `$route`


## RouterLink

1.希望输出为一个a标签:

`<router-link>xxx</router-link>`

`<a herf="#/yyy>xxx</a>`

2.默认插槽的处理

3.输入时必要的 to 属性
