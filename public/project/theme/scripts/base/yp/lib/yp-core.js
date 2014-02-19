/* 框架初始化 */
!function(win, $) {
var 
  yp = function(conf) {
    return yp.mix(true, new yp.fn.create(conf), yp);
  }
  yp.fn = yp.prototype = {
    constructor: yp
  , yp: '20131227.1'
  , create: function(conf) {
      /*this.conf = conf || {};*/
      this.config.init();
      this.loader.init();
      return this;
    }
  }
  yp.fn.create.prototype = yp.fn;
  yp.create = yp.fn.create;///

  /* 语法糖扩展 */
  ///yp.$ = $;
  // 对象扩展
  yp.mix = $.extend;
  yp.extend = function(a, b) {
    return yp.mix({}, a, b);///
  };
  // 对象循环
  yp.each = function(arr, callback) {
    return $.each(arr, function(a, b) {
      return callback(b, a);
    });
  };
  // 代理函数
  yp.proxy = $.proxy;
  // 模板函数
  yp.format = function(str, data) {
    var re = yp.config.fun.formatSettings.re || /{([\s\S]+?)}/g
    if (typeof data !== 'object') data = [].slice.call(arguments, 1);
    return str.replace(re, function($0, $1) {
      return data[$1] != null ? data[$1] : '';
    });
  };
  // 空函数
  yp.noop = $.noop;

  yp.mix(yp, {
    rword: /[^, ]+/g
  , global: {}  /*全局变量*/
  , config: {}  /*全局配置*/
  , loader: {}  /*资源加载*/
  , loger: {}   /*日志输出*/
  , mods: {}    /*全局模块*/
  , cache: {}   /*全局缓存*/
  , event: {}   /*全局事件*/
  , ui: {}      /*全局UI*/
  , system: {}  /*系统函数*/
  });

  win.yp = yp;
  define( 'yp', [], function() { return yp; } );
}(this, jQuery);

/* 全局配置config */
!function($, yp) {
var
  win = this///
, api = yp.mix(yp.config, win.oYpConfig)

  // 动态设置函数
  api.data = function(key, val) {
    // 自定义
  };

  // 初始化
  api.init = function() {
    api.mods.css = {};
    api.mods.jq = {};
    yp.each(api.mods.modList, function(val, key) {
      api.loader.require.paths[key] = val.js;
      yp.each(['shim'], function(name) {
        if (val[name]) {
          api.loader.require[name][key] = val[name];
        }
      });
      yp.each(['css', 'jq'], function(name) {
        if (val[name]) {
          api.mods[name][key] = val[name];
        }
      });
    });
  };

  define( 'yp.config', [], function() { return api; } );
}(jQuery, yp);

/* 全局事件管理event */
!function($, yp) {
var 
  api = yp.event
, o = $({})
  
  api.sub = function() {
    var eventName = arguments[0]
      , data = o.data(eventName.replace(/\..*/, ''))
    if (data) {
      var callback = arguments[1]
      callback(data);
      return;
    }
    o.on.apply(o, arguments);
  };
  api.unsub = function() {
    o.off.apply(o, arguments);
  };
  api.pub = function() {
    o.trigger.apply(o, arguments);
    var eventName = arguments[0]
    return {
      cache: function(val) {
        eventName = typeof eventName === 'string' ? eventName : eventName.type + '.' + eventName.namespace;///
        o.data(eventName, val || true);///
      }
    }
  };

  // 系统观察者
  $.sub = api.sub;
  $.unsub = api.unsub;
  $.pub = api.pub;

  // 页面观察者
  yp.each(['sub', 'unsub', 'pub'], function(name) {
    yp[name] = function() {
      if (typeof arguments[0] === 'string') arguments[0] = 'yp/' + arguments[0];
      return $[name].apply(null, arguments);
    };
  });
}(jQuery, yp);

/* 静态文件加载loader */
!function($, yp) {
var
  win = this///
, config = yp.config
, api = yp.loader

  // 对指定函数进行包裹
, wrap = function(value, wrapper) {
    return function() {
      var args = [value];///
      [].push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  }
  // 参数数组前插yp
, insertCore = function(func) {
    return wrap(yp, func);///new yp()
  }
  /// 检测文件类型
, getType = function(url) {
    var ext = 'js'
      , tmp = url.replace(/[?#].*/, '')
    if (/\.(\w+)$/.test( tmp )) ext = RegExp.$1;
    return ext;
  }
  /// 加载css文件
, loadCSS = function(url) {
    var DOC = document
      , head = DOC.getElementsByTagName('head')[0]
      , id = url.replace(/[?#].*/, '')
    if (DOC.getElementById(id)) return;
    var node     =  DOC.createElement("link");
    node.rel     = "stylesheet";
    node.href    = url;
    node.id      = id;
    head.insertBefore( node, head.firstChild );
  }
  api.loadCSS = function() {
    arguments[0] = config.loader.baseUrlList.css + arguments[0] + '.css';///
    loadCSS.apply(this, arguments);
  };

  // 加载模块
  api.use = function(plugs, callback) {
    if (plugs) {
      plugs = String(plugs).match(yp.rword);
      if (callback) {
        callback = wrap(callback, function(func) {
          var args = [].slice.call(arguments, 1)
          $.sub('base-ready', function() {
            insertCore(func).apply(null, args);///
            $.pub('loader-ready-page', plugs);///
          });
        });
      }
      require(plugs, callback);///
    }
  };
  yp.use = api.use;

  // 全局页面初始化完成
  api.ready = function() {
    var nReadyCount = 2///
    $.sub('base-ready doc-ready', function() {
      if (--nReadyCount <= 0) {
        api.ready();
      }
    });
    return function(callback) {
      if (callback) {
        /// 触发内部初始化事件，可能重复触发
        $.pub('yp/init').cache();
        $.sub('yp/ready', callback);
      } else {
        // 触发页面初始化事件
        $.pub('yp/ready').cache();
      }
    }
  }();
  yp.init = yp.ready = api.ready;///

  // 扩展配置参数
  api.config = function(configLoader) {
    yp.mix(config.loader, configLoader);
    require.config(config.loader.require);
  }

  // 初始化
  api.init = function() {
    // 配置参数
    require.config(config.loader.require);
    // 加载核心文件
    require(config.loader.baseList, function() {
      $.pub('base-ready').cache();
    });
    $(document).on('loader-complete', function(e, mod) {
      $.sub('base-ready', function() {
        $.pub('loader/ready', [mod]);
      });
    });
    // 文档加载
    $(function() {
      $.pub('doc-ready').cache();///
    });
  }
}(jQuery, yp);

// yp框架初始化
yp.create();