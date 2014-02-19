yp.use('pagination', function(yp) {
  yp.ready(function() { 
    "use strict";
    var ui = yp.ui;
    ui['$paginate'] = $('.dataTables_paginate');
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
          
          vm.projectList = [];  // 我的项目列表
          vm.admin = {}; // 当前用户
          vm.states = {}; // 状态对象
          vm.stateArray = []; // 状态数组

          vm.currentPage = 1; // 当前页
          vm.totalRecords = 0 // 总记录数
          vm.pageSize = 100; // 每页的记录数

          vm.searchName = ''; //搜索--项目名称
          vm.searchType = '0'; //搜索---项目类型

          vm.init = function() {
            vm.admin = window.admin; // 当前用户
            vm.states = window.states; // 状态对象

            // 获得参数
            if(ui.$content.data('params') != undefined) {
              var params = $.parseJSON((ui.$content.data('params')).replace(/\'/g,'\"'));
              vm.currentPage = params.currentPage;
            }         

            // 状态
            var stateArray = [];
            // 仅枚举对象自身, 不沿原型链向上查
            for (var key in vm.states.$model) {
              stateArray.push({'id': key, 'name': vm.states[key]});
            }
            vm.stateArray = stateArray;       
          };

          /* 操作 */
          // 搜索
          vm.searchBtn = function() {
            oPage.doAjax('/data/project/list', options1, callback1);
          };

          // 查看
          vm.lookFun = function() {
            var self = this,
                id = this.$model.project['_id'];
            ui.$content.data('id', id).data('currentPage', vm.currentPage);
            ui.$content.load('html/detailProject.html');
            ui.$menu.find('#menu_list>li a').removeClass('active');
          };

          // 删除
          vm.deleteFun = function() {
            var self = this,
                id = this.$model.project['_id'];
            bootbox.confirm('确定要删除此项目吗？', function(result) {
              notyfy({
                text: '你点击了：' + ( result ? '确定' : '取消' )
              , type: 'primary'
              , layout: 'topRight'
              , timeout: 2000
              });
              if(result) {
                // 确定删除
                var options3 = {
                  'conditionObj': {'_id': id}
                };
                var callback3 = function() {
                  // 请求第一页数据
                  vm.currentPage = 1;
                  oPage.doAjax('/data/project/list', options1, callback1);
                };
                oPage.doAjax('/data/project/del', options3, callback3);             
              }
            });
          };

          // 更新个人
          vm.updateIFun = function() {
            var self = this,
                id = this.$model.project['_id'];
            ui.$content.data('id', id).data('currentPage', vm.currentPage);
            ui.$content.load('html/updateI.html');
            ui.$menu.find('#menu_list>li a').removeClass('active');
          };

          // 更新项目
          vm.updatePFun = function() {
            var self = this,
                id = this.$model.project['_id'];
            ui.$content.data('id', id).data('currentPage', vm.currentPage);
            ui.$content.load('html/updateP.html');
            ui.$menu.find('#menu_list>li a').removeClass('active');
          };

          // 提交结项
          vm.applyFun = function() {
            var self = this,
                id = self.$model.project['_id'];
            bootbox.confirm('确定要提交结项吗？', function(result) {
              notyfy({
                text: '你点击了：' + ( result ? '确定' : '取消' )
              , type: 'primary'
              , layout: 'topRight'
              , timeout: 2000
              });
              if(result) {
                var options4 = {
                  'conditionObj': {'_id': id},
                  'fieldObj': {
                    'state': 6
                  }
                };
                var callback4 = function() {
                  self.$model.project['state'] = 6;
                };             
                oPage.doAjax('/data/project/list', options4, callback4);
              }
            });
          };

          // 审核
          // vm.checkFun = function() {
          // };

          // 结项
          vm.finishFun = function() {
            var self = this,
                id = this.$model.project['_id'];
            ui.$content.data('id', id).data('currentPage', vm.currentPage);
            ui.$content.load('html/finishProject.html');
            ui.$menu.find('#menu_list>li a').removeClass('active');
          };
          /* 操作 end */
        });
        avalon.scan();
        oPage.data.init();

        /* 请求列表数据 */
        // 参数
        // var options1 = {
        //   'name': oPage.data.searchName,   
        //   'state': oPage.data.searchType,
        //   'uid': oPage.data.admin.uid,
        //   'pagination': {
        //     'perCount': oPage.data.pageSize,
        //     'curPage': oPage.data.currentPage
        //   }
        // };
        var options1 = {
          'uid': oPage.data.admin.uid
        };
        // 回调函数
        var callback1 = function(list) {
          oPage.data.projectList = list;
          oPage.data.totalRecords = list.length == 0 ? 0 : list[0]['totalCount'];        
          // 初始化翻页
          ui.$paginate.data('pagination', null).pagination({
              count: oPage.data.totalRecords  // 总共1000条
            , prePage: oPage.data.pageSize   // 每页10条
            , curPage: oPage.data.currentPage // 当前第5页
            , onPageChange: function(page, jumpUrl){
              var callback2 = function(list) {
                oPage.data.projectList = list;
                oPage.data.totalRecords = list.length == 0 ? 0 : list[0]['totalCount'];
                oPage.data.currentPage = page;
              };
              var options2 = {
                'uid': oPage.data.admin.uid,
                'pagination': {
                  'perCount': oPage.data.pageSize,
                  'curPage': page
                }
              };
              oPage.doAjax('/data/project/list', options2, callback2);
            }
          });
        };
        // 请求列表数据
        oPage.doAjax('/data/project/list', options1, callback1);
        /* 请求列表数据 end */
      },
      /* 绑定监听事件 */
      listen: function() {
        var vm = oPage.data;   
      },
      doAjax: function(url, options, callback) {
        var vm = oPage.data;
        yp.ajax(url, {type: 'post', data: options})
          .done(function(msg) {
          if(msg.code == 1) {
            callback(msg.data);
          }
        });
      }
    };
    oPage.init();
  });
});