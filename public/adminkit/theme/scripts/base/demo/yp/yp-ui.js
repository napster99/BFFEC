/**
 * 全局UI方法
 */
!function($, yp) {
var
  win = this
, exports = yp
, global = exports.global
, ui = exports.ui
  
  // 保存常用对象
  ui.$win = $(win);
  ui.$doc = $(document);
  ui.$body = $(document.body);
  ui.support = {};
  // 保存框架对象
  ui.$menu = $('#menu');
  ui.$content = $('#content');

  global.zIndex = 999;
  var resizeWindow = function() {
    global.width = ui.$win.width();
    global.height = ui.$win.height();
  }
  resizeWindow();
  $.sub('ui/resize.ui', function() {
    resizeWindow();
    $.pub('ui/main/resize');
  });

  // 框架主内容加载
  ui.loadMain = function(href) {
    var dfd = $.Deferred()
    $.pub('ui/unload');
    ui.$content.load(href, function() {
      $.pub('ui/update', ui.$content);
      // 显示源码
      $('.btn-source-toggle').click(function(e) {
        e.preventDefault();
        $('.code:not(.show)').toggleClass('hide');
      });
      if (!~href.indexOf('html/breadcrumb.html')) {
        ///$('<div>').load('html/breadcrumb.html').prependTo(ui.$content);
      }
      dfd.resolve();
      $.pub('ui/load', {url: href});
    });
    return dfd;
  };
  // 解决ajax被替换的问题
  var $_ajax = $.ajax;
  $.sub('ui/unload.ui', function(e, data) {
    yp.pub('ui/unload');
    $.ajax = $_ajax;
    yp.unsub('ui/unload');
  });
  $.sub('ui/load.ui', function(e, data) {
    yp.pub('ui/load', data);
    yp.unsub('ui/load');
  });
  
  /// 测试模块，上线时删除
  if (yp.config.test) {
    +function() {
      yp.sub('ui/load', function(e, data) {
        data.url.replace(/.*\/(.*)\.html/, function($0, $1) {
          yp.use('../test/' + $1);
        });
      });
    }();
  }

  // 添加菜单项
  ui.addMenuItem = function(id, content) {};
  ui.removeMenuItem = function(id) {};

  // 监听错误消息
  $.sub('error/ui.ui', function(e, msg) {
    var e = $.Event('yp/ui/error/' + msg.code)
    yp.pub(e, msg.data);
    if (e.isDefaultPrevented()) return;
    alert(msg.message);
  });
  $.sub('error/sys.ui', function(e, msg) {
    yp.log(msg.message);
  });

  // sticky支持
  ui.support.sticky = $('<i style="position:sticky">').css('position') === 'sticky';

  define( 'yp.global', [], function() { return global; } );
  define( 'yp.ui', [], function() { return ui; } );
}(jQuery, yp);

/**
 * 事件模块扩展
 */
!function($, yp) {
var
  win = this
, exports = yp
, ui = exports.ui
, event = exports.event

  // 监听窗口大小改变事件
  ui.$win.on('resize.event', function() {
    $.pub('ui/resize');
  });

  // 监听页面初始化事件
  yp.sub('page/domCreate', function(e, data) {
    $.pub('ui/update', data.target);
    return false;
  });
  ui.$doc.on('dom.create', function(e) {
    $.pub('ui/update', e.target);
    return false;
  });
  /// 监听插件创建元素事件
  // ui.$body.on('tabsadd.event', function(e, data) {
  //   var $target = $(e.target).find('.tabc').eq(data.index)////
  //   $.pub('ui-update', $target);
  //   return false;
  // });
  // 替换jq方法
  // yp.each(['load', 'append', 'appendTo', 'prepand', 'prepandTo'], function(name) {
  //   yp[name] = function(target, content) {
  //     $.pub('ui/update', target);
  //     $(target)[name](content);
  //   };
  // });
    
  // 监听全局ajax完成事件
  ui.$doc.ajaxComplete(function() {
    $.pub('loader/ajaxDone');
  });
  ui.$doc.on('submit', 'form', false);

  // 监听侧边栏宽度变化
  ui.$menu.on('resizestop', function() {
    $.pub('ui/main/resize');
  });
}(jQuery, yp);