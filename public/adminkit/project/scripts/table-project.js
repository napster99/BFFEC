yp.use('mvvm', function(yp) {
  yp.ready(function() { 
    "use strict";
    var ui = yp.ui;
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
          vm.states = {};       
          vm.stateArray = [];

          vm.projectList = [];

          vm.init = function() {
            
            // 状态
            vm.states = window.states;
            var stateArray = [];
            // 仅枚举对象自身, 不沿原型链向上查
            for (var key in vm.states.$model) {
              stateArray.push({'id': key, 'name': vm.states[key]});
            }
            vm.stateArray = stateArray; 
            
          };

          
        });
        avalon.scan();

        yp.ajax(window.serverUrl + '/data/project/list')
          .done(function(msg) {
            if(msg.code == 1) {
              oPage.data.projectList = msg.data;
              oPage.data.init();
            }
          });
        
      },
      /* 绑定监听事件 */
      listen: function() {
        var vm = oPage.data;
        
      }
    };
    oPage.init();
  });
});