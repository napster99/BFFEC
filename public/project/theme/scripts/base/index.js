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

          ///
        });

        avalon.scan();
        oPage.data.init();
      }
      /**
       * 绑定监听事件
       */
    , listen: function() {
        var vm = oPage.data

        ///
      }
    };

    oPage.init();
  });
});