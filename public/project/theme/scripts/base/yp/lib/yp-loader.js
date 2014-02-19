/* ==========================================================
 * yp: loader.js v0.1.2.20131122
 * ==========================================================
 * Copyright 2013 xiewu
 *
 * 全局数据加载模块
 * ========================================================== */

+function($, yp) {
var
  exports = yp
, config = exports.config
, api = exports.loader

  /* 异步提交 */
, ajax = function(url, opts) {
    if (typeof url !== 'string') {
      opts = url;
      url = opts.url;
    } else {
      opts = opts || {};
    }
    // 自定义loading显示
    var toggleLoaderBar = function(flag) {
      if (opts.loaderBar) api.loaderBar.toggle(flag);
    };
    // 完成回调
    var alwaysCallback = function() {
      toggleLoaderBar(false);
    };
    // 异常回调
    var failCallback = function(msg, status, throws) {
      var errMsg = {
            timeout: '请求超时，请稍候重试'
          , error: '服务器错误，请联系管理员'
          , parsererror: '返回格式不合法，请联系管理员'
          }
        , errMsg_text = errMsg[status] || msg.message || errMsg['error']
        , e = $.Event('yp/' + 'loader/ajax/fail/' + msg.type)
      
      yp.pub(e, msg);
      if (e.isDefaultPrevented()) return;
      $.pub('error/ui', {code:'ajax/fail', message:errMsg_text, data:msg});
    };
    var deferred
    opts.type = opts.type || config.loader.type || 'get';
    toggleLoaderBar(true);

    deferred = api[opts.type].ajax(url, opts);
    return deferred.fail(failCallback).always(alwaysCallback);
  }

  /* 异步提交表单 */
, ajaxSubmit = function(url, opts) {
    if (typeof url !== 'string') {
      opts = url;
      url = opts.url;
    } else {
      opts = opts || {};
    }
    var $target = $(opts.target);
    if (!$target.length) {
      $.pub('error/ui', {code:'noFormSubmit', message:'没有找到要提交的表单'});
      return false;
    }
    // 触发表单序列化事件
    var $btnSubmit = $target.find(':submit[type=submit]');
    $target.trigger('form-pre-serialize', [$target, $btnSubmit]);

    if (opts.beforeSubmit && opts.beforeSubmit($target, opts) === false) {
      return this;
    }

    // 触发验证事件
    var e = $.Event('form-submit-validate')
    $target.trigger(e);
    if (e.isDefaultPrevented()) return;

    url = url || $target.attr('action');
    var type = opts.type || $target.attr('method') || config.loader.type || 'post';
    var data_pre = config.loader.data_pre || 'doSubmit=1'
    var data_list = [data_pre];
    var data = $target.serialize();
    data && data_list.push(data);
    data = opts.data;
    data && (typeof(data) != 'string' && (data = $.param(data)));
    data && data_list.push(data);
    data = data_list.join('&');
    var callback = opts.success;
    var loaderBar = opts.loaderBar;

    // 触发表单提交事件
    $target.trigger('form-submit-notify');

    return ajax(url, {
        type: type
      , data: data
      , loaderBar: loaderBar///
      })
      .done(callback)
      .always(function(e) {
        $target.trigger('form-ajax-always', [$target, $btnSubmit]);
      });
  };
  api.ajax = exports.ajax = ajax;
  api.ajaxSubmit = ajaxSubmit;

  $.fn.ajaxSubmit = function(url, opts) {
    if (typeof url !== 'string') {
      opts = url || {};
    } else {
      opts = opts || {};
      opts.url = url;
    }
    opts.target = this;
    this.ajax = ajaxSubmit(opts);
    return this;
  }

  // 监听表单事件
  $.sub('form-pre-serialize', function(e, form, $btnSubmit) {
    $btnSubmit.prop('disabled', true);
  });
  $.sub('form-validate-fail form-ajax-always', function(e, form, $btnSubmit) {
    $btnSubmit.prop('disabled', false);
  });

  /* 通用异步模块 */
  yp.each(['get', 'post'], function(type) {
    api[type] = $;
    ///exports[type] = $[type];
  });

  // loading模块
  api.loaderBar = {
    dom: $('<div>loading...</div>')
  , toggle: function(flag) {
      if (flag) this.dom.appendTo('body');
      else this.dom.remove();
    }
  };

  define( 'yp.loader', [], function() { return api; } );
}(jQuery, yp);