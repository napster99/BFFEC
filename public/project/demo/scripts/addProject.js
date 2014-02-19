yp.use('select2', function(yp) {
  yp.ready(function() { 
    "use strict";
    var ui = yp.ui;
    ui['$projectPR'] = $("#projectPR");
    var oPage = {
      /* 初始化 */
      init: function() {
        this.view();
        this.listen();
      },
      /* 视图显示 */
      view: function() {
        // 定义控制器
        oPage.data = avalon.define('page', function(vm) { 

          vm.participators = [];    
          vm.types = [];
          vm.prioritys = [];
          vm.states = {};
          vm.admin = {};
          vm.time = '';

          vm.init = function() {

            vm.participators = window.participators;    
            vm.types = window.types;
            vm.prioritys = window.prioritys;
            vm.states = window.states;
            vm.admin = window.admin;

            // 时间初始化
            var 
              date = new Date(),
              now = "";
            now = date.getFullYear() + "-"; 
            now = now + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))+ "-";
            now = now + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
            vm.time = now;

          };

          // 表单提交
          vm.submitBtn = function(e) {
            var params = $('#addForm').serialize();
            var optionsArray = params.split('&');
            var options = {};
            for(var i = 0, len = optionsArray.length; i < len; i++) {
              var itemArray = optionsArray[i].split('=');
              if('joinPerson' == itemArray[0]) {
                if(options[itemArray[0]] == undefined) {
                  options[itemArray[0]] = [];
                }
                options[itemArray[0]].push(itemArray[1]);
              } else{
                options[itemArray[0]] = itemArray[1];
              }        
            }
            // 负责功能模块
            options['persons'] = {

            }

            yp.ajax('/data/project/add', {type: 'post', data: options})
              .done(function(msg) {
              if(msg.code == 1) {
                ui.$content.load('html/projectList.html');
                ui.$menu.find('#menu_list>li a').removeClass('active');
              }
            });

          };

        });
        avalon.scan();
        oPage.data.init();
      },
      /* 绑定监听事件 */
      listen: function() {
        var vm = oPage.data;
        ui.$projectPR.select2({
          placeholder: "请选择"
        });
      }
    };
    oPage.init();
  });
});