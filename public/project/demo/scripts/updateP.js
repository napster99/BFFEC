yp.use('select2', function(yp) {
  yp.ready(function() { 
    "use strict";
    var ui = yp.ui;
    ui['$projectPR'] = $("#projectPR");
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
          vm.approvalStartTime = '';
          vm.approvalEndTime= '';
          
          vm.admin = {};
          vm.participators = [];    
          vm.types = [];
          vm.prioritys = [];
          vm.stateArray = [];
          vm.states = {};

          vm.init = function() {
            vm.resPerson = vm.projectInfo.resPerson;
            vm.joinPersons = vm.projectInfo.joinPersons;
            vm.approvalStartTime = vm.projectInfo.approvalStartTime;
            vm.approvalEndTime = vm.projectInfo.approvalEndTime;

            vm.admin = window.admin;
            vm.participators = window.participators;    
            vm.types = window.types;
            vm.prioritys = window.prioritys;
            vm.states = window.states;
            var stateArray = [];
            // 仅枚举对象自身, 不沿原型链向上查
            for (var key in vm.states.$model) {
              stateArray.push({'id': key, 'name': states[key]});
            }
            vm.stateArray = stateArray;   
            ui.$projectPR.select2();         
          };

          vm.backBtn = function() {
            ui.$content.load('html/projectList.html');
            ui.$menu.find('#menu_list>li a').removeClass('active');
          };

          vm.submitBtn = function() {

            var params = $('#updateForm').serialize(),
                optionsArray = params.split('&'),
                options = {};
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
            var parameters = {
              'conditionObj' : {
                '_id': id
              },
              'fieldObj': options
            };

            yp.ajax('/data/project/edit', {type: 'post', data: parameters})
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