/*
* 路由解析，根据controllers下各个文件定义的路径进行路由指派
*/
var methods = require('../lib/methods');
var FS = require("fs");
var Path = require('path');
/**
 * Main function to initialize routers of a Express app.
 * 
 * @param  {Express} app  Express app instance
 * @param  {Object} paths (optional) For configure relative paths of
 *                        controllers and filters rather than defaults.
 */
exports.route = function (app, paths) {
  paths = paths || {};
  var ctrlDir = Path.normalize( __dirname + '/../' + (paths.controllers || '/controllers') );
  var fltrDir = Path.normalize( __dirname + '/../' + (paths.filters || '/filters') );

  // 获取controllers
  var files = FS.readdirSync(ctrlDir)
    , path
    , router, j, p, r, f, eachRouter, filters

  for( var i = 0, len = files.length; i < len; i++ ){
    path = Path.basename(files[i], '.js');
    path = ( 'index' == path ) ? '' : '/' + path;
    router = require(ctrlDir + path);
    for( j in router.controllers ){
      p = ('/' + path + j);
      if( p != '/' ){
        p = p.replace(/\/$/, "");
      }
      r = router.controllers[j];
      f = router.filters ? router.filters[j] : null;
      methods.forEach(function (method) {
        eachRouter = r[method] || null;
        if (eachRouter) {
          filters = f ? (f[method] || []).map(function (item) {
            return require(fltrDir + '/' + item);
          }) : [];
          app[method].apply(app, [p].concat(filters).concat([eachRouter]));
        }
      });
    }
  }
  // 设置404
  app.get('*', function(req, res){
    res.send('页面不存在', 404);
  });
  app.post('*', function(req, res){
    res.ajaxReturn(1, {}, '请求不存在');
  });
};