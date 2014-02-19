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
          vm.joinPerson = [];
          vm.approvalStartTime = '';
          vm.approvalEndTime= '';
          
          vm.simpleSpeed = 0;
          vm.startTime = 0;
          vm.endTime = 0;
          vm.todo = '';

          vm.states = {};
          vm.admin = {};

          vm.init = function() {
            vm.states = window.states;
            vm.admin = window.admin;

            vm.resPerson = vm.projectInfo.resPerson;
            vm.joinPersons = vm.projectInfo.joinPersons;
            vm.joinPerson = vm.projectInfo.joinPerson;
            vm.approvalStartTime = vm.projectInfo.approvalStartTime;
            vm.approvalEndTime = vm.projectInfo.approvalEndTime;

            if(!(vm.joinPerson.indexOf(vm.admin.uid) > -1)) {
              vm.simpleSpeed = (vm.resPerson.speed.length == 0 ? 0 : vm.resPerson.speed);
              vm.startTime = vm.resPerson.startTime;
              vm.endTime = vm.resPerson.endTime;
              vm.todo = vm.resPerson.todo;
            } else{
              for(var i = 0, len = vm.joinPersons.length; i < len; i++) {
                if(vm.joinPersons[i].uid == vm.admin.uid) {
                  vm.simpleSpeed = (vm.joinPersons[i].speed.length == 0 ? 0 : vm.joinPersons[i].speed);
                  vm.startTime = vm.joinPersons[i].startTime;
                  vm.endTime = vm.joinPersons[i].endTime;
                  vm.todo = vm.joinPersons[i].todo;
                  break;
                }
              } 
            }        
          };

          vm.backBtn = function() {
            ui.$content.load('html/projectList.html');
            ui.$menu.find('#menu_list>li a').removeClass('active');
          }

          vm.submitBtn = function() {
            var options = {
              'conditionObj' : {
                'pid': id,
                'uid': oPage.data.admin.uid
              },
              'fieldObj': {
                'speed': vm.simpleSpeed,
                'startTime': vm.startTime,
                'endTime': vm.endTime,
                'todo': vm.todo,
                'role': vm.admin.role
              }
            };
            yp.ajax('/data/user/projectEdit', {type: 'post', data: options})
              .done(function(msg) {
              if(msg.code == 1) { 
                ui.$content.load('html/projectList.html');
                ui.$menu.find('#menu_list>li a').removeClass('active');
              }
            });            
          };
          
        });  
        avalon.scan(); 

        yp.ajax('/data/project/list', {type: 'get', data: {'_id': id}})
          .done(function(msg) {
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