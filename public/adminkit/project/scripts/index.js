/* ==========================================================
 * yp: index.js v20131218
 * ==========================================================
 * Copyright xiewu
 *
 * 查找用户页面
 * ========================================================== */

yp.use('mvvm', function(yp) {
  yp.ready(function() { 
    "use strict";
    var ui = yp.ui;
    var oPage = {
      /* 初始化 */
      init: function() {
        this.view();
        this.bindEvent();
      },
      /* 视图显示 */
      view: function() {
        var self = this;
        // 定义控制器
        self.data = avalon.define('page', function(vm) {
          vm.init = function() {
          };
          vm.reset = function() {
          };
          vm.reset();
        });
        avalon.scan();
        self.data.init();
      },
      /* 绑定监听事件 */
      bindEvent: function() {
        var vm = oPage.data;

        window.serverUrl = 'http://127.0.0.1:3001';

        /* 初始化数据 */
        // 类型
        window.types = [
            {
              'id': 1
            , 'name': '活动'
            }
          , {
              'id': 2
            , 'name': '官网'
            }
          , {
              'id': 3
            , 'name': '子站'
            }
          , {
              'id': 4
            , 'name': '工具'
            }
          , {
              'id': 5
            , 'name': '数据'
            }
          , {
              'id': 6
            , 'name': '创新'
            }
        ];

        // 优先级
        window.prioritys =  [
            {
              'id': 1
            , 'name': '低'
            }
          , {
              'id': 2
            , 'name': '中'
            }
          , {
              'id': 3
            , 'name': '高'
            }
        ];

        // 状态
        window.states = {
          '0': '请选择'
        , '1': '未开始'
        , '2': '等待审核'
        , '3': '审核通过'
        , '4': '审核不通过'
        , '5': '进行中'
        , '6': '待结项'
        , '7': '已完成'
        };

        // 获得当前用户数据
        yp.ajax(window.serverUrl + '/getCurrentUserInfo', {type: 'get'})
          .done(function(msg) {
          if(msg.code == 1) {
            window.admin = msg.data;
          }
        });

        // 获取所有用户的信息
        yp.ajax(window.serverUrl + '/getAllUserInfo', {type: 'get'})
          .done(function(msg) {
          if(msg.code == 1) {
            window.participators = msg.data;
          }
        });

        /* 初始化数据 */

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