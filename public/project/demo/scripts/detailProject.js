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
        
        // 获得项目id
        var id = ui.$content.data('id');

        // 定义控制器
        oPage.data = avalon.define('page', function(vm) {  
          vm.projectInfo = {};
          vm.resPerson = {};
          vm.joinPersons = [];
          vm.states = {};
          vm.approvalStartTime = '';
          vm.approvalEndTime= '';
          
          vm.init = function() {
            vm.resPerson = vm.projectInfo.resPerson;
            vm.joinPersons = vm.projectInfo.joinPersons;
            vm.approvalStartTime = vm.projectInfo.approvalStartTime;
            vm.approvalEndTime = vm.projectInfo.approvalEndTime;
            vm.states = window.states;
          };

          vm.backBtn = function() {
            ui.$content.load('html/projectList.html');
            ui.$menu.find('#menu_list>li a').removeClass('active');
          }
          
        });  
        avalon.scan();
        
        yp.ajax('/data/project/list', {type: 'get', data: {'_id': id}}).done(function(msg) {
          if(msg.code == 1) { 
            oPage.data.projectInfo = msg.data[0];
            oPage.data.init();
          }
        });
      },
      /* 绑定监听事件 */
      bindEvent: function() {
        var vm = oPage.data;

      }
    };
    oPage.init();
  });
});