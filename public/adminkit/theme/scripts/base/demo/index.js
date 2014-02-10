/* ==========================================================
 * yp: index.js v20140106
 * ==========================================================
 * Copyright xiewu
 *
 * 配管系统框架
 * ========================================================== */

yp.use('mvvm', function(yp) {
  yp.ready(function() { "use strict";
    var ui = yp.ui;

    var oPage = {
      /**
       * 初始化
       */
      init: function() {
        this.view();
        this.listen();
      }
      /**
       * 视图显示
       */
    , view: function() {
        // 定义控制器
        oPage.data = avalon.define('page', function(vm) {
          // 初始化
          vm.init = function() {
            ///
          };
        });

        avalon.scan();
        oPage.data.init();
      }
      /**
       * 绑定监听事件
       */
    , listen: function() {
        var vm = oPage.data

        // 菜单项点击
        ui.$menu.on('click', 'a', function() {
          var $this = $(this)
            , $li = $this.closest('li').filter(':not(.hasSubmenu)')

          if ($this.hasClass('disabled') || $li.hasClass('active')) return false;
          if ($li.closest('.ztree').length) return false;

          ui.$menu.find('.hasSubmenu .active').removeClass('active');
          $li.addClass('active');
          // 主内容区加载
          ui.loadMain(this.href);
          return false;
        })
        .find('.hasSubmenu .active').removeClass('active').find('a').click();
      }
    };

    oPage.init();
  });
});