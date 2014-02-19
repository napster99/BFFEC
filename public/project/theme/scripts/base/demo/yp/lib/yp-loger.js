/* ==========================================================
 * yp: loger.js v0.1.2.20131122
 * ==========================================================
 * Copyright 2013 xiewu
 *
 * 调试日志输出模块
 * ========================================================== */

+function($, yp) {
var
  win = this
, console = win.console || {}
, config = yp.config
, api = yp.loger
  
  // 可选模式(console/alert/dom)
  api.mode = 'console';

  /**
   * 日志输出接口
   * @param   {String}    要输出的数据内容
   */
  api.log = function() {
    var mode = this.mode || api.mode
    if (mode === 'console' && console.log) {
      console.log.apply(console, ['yp调试：'].concat(arguments));
    } else if (mode === 'alert') {
      alert('yp调试：' + arguments[0]);
    } else {
      $('body').append('<div>yp调试：' + arguments[0] + '</div>');
    }
  };

  /**
   * 初始化
   */
  api.init = function() {
    if (!config.debug) {
      api.log = console.log = function() {};
    }
    yp.log = api.log;
  };
  api.init();

  define( 'yp.loger', [], function() { return api; } );
}(jQuery, yp);