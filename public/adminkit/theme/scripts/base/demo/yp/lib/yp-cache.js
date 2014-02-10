/* ==========================================================
 * yp: cache.js v0.1.5.20131125
 * ==========================================================
 * Copyright 2013 xiewu
 *
 * 全局缓存模块
 * ========================================================== */

+function($, yp) {
var 
  win = this
, api = yp.cache

  // 实例集合
  api.list = {};

  // cookie
  api.cookie = function( key, value, options ) {
    if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
      options = $.extend({}, options);
      if (value === null || value === undefined) {
        options.expires = -1;
      }
      if (typeof options.expires === 'number') {
        var days = options.expires, t = options.expires = new Date();
        t.setDate(t.getDate() + days);
      }
      value = String(value);
      return (document.cookie = [
        encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '',
        options.path  ? '; path=' + options.path : '',
        options.domain  ? '; domain=' + options.domain : '',
        options.secure  ? '; secure' : ''
      ].join(''));
    }
    options = value || {};
    var decode = options.raw ? function(s) { return s; } : decodeURIComponent;
    var pairs = document.cookie.split('; ');
    for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
      if (decode(pair[0]) === key) return decode(pair[1] || '');
    }
    return null;
  };

  // 返回实例
  api.create = function(type) {
    return api.list[type || 'memory'];
  };

  // 初始化
  api.init = function() {
    var obj = {}
    yp.each(['memory', 'cookie', 'localStorage'], function(name) {
      var _name = name
      if (_name === 'localStorage') {
        if ( typeof win.localStorage === 'object' ) {
          obj = win.localStorage;
        } else {
          _name = 'cookie';
        }
      }
      if (_name === 'cookie') {
        obj = {
          removeItem: function(key) {
            api.cookie(key, null);
          }
        };
        obj.getItem = obj.setItem = api.cookie;
      }
      if (_name === 'memory') {
        var channel = win.top
        obj = {
          /**
           * 跨框架数据共享接口
           * @param   {String}    存储的数据名
           * @param   {Any}       将要存储的任意数据(无此项则返回被查询的数据)
           */
          data: function (name, value) {
            var cache = channel['_CACHE'] || (channel['_CACHE'] = {});
            return value === undefined ? cache[name] : (cache[name] = value, this);
          }
          /**
           * 数据共享删除接口
           * @param   {String}    删除的数据名
           */
        , removeItem: function (name) {
            var cache = channel['_CACHE'];
            if (cache && cache[name]) delete cache[name];
            return this;
          }
        };
        obj.getItem = obj.setItem = obj.data;
      }
      api.list[name] = obj;
    });
  };
  api.init();

  define( 'yp.cache', [], function() { return api; } );
}(jQuery, yp);