Node-twitter 说明
==========================

基于Node.js、MongoDB及express3.0+ Node框架开发的在线微博系统


目录结构
-------------------------------
0） **统一使用UTF-8编码**;

1） github上Node-twitter目录结构说明;

```
  | -- models         // 项目所依赖的模块、包
  | -- node_moudules  // Node所依赖的模块、包 express、mongodb 等
  | -- public         // 用户能访问的公开目录，其中包含images、javascripts及stylesheets
  | -- routes         // js路由分发器，相当于整个项目的控制层
  | -- views          // 项目视图层，包含ejs模板
  | -- app.js         // 项目入口程序
  | -- package.json   // 项目信息配置说明
  | -- settings.js    // MongoDB配置参数


```