/* ==========================================================
 * yp: config.js v20140106
 * ==========================================================
 * Copyright xiewu
 *
 * 全局配置模块
 * ========================================================== */
!function(win) {
  
  var api = win.oYpConfig

  // 调试模式控制器
  api.debug = true;

  // 公共函数配置
  api.fun = {
    // 模板函数正则
    formatSettings: {
      re: /\${([\s\S]+?)}/g
    }
  };

  // 模块加载配置
  api.mods = {
    // 模块列表
    // 可陪参数包括（js文件路径，css文件路径，shim依赖模块，jq方法名）
    modList: {
      'yp-ui': {
        js: '../demo/yp/yp-ui'
      }
    , 'yp-mods': {
        js: '../demo/yp/yp-mods'
      }
    , 'yp-loger': {
        js: '../demo/yp/lib/yp-loger'
      }
    , 'yp-cache': {
        js: '../demo/yp/lib/yp-cache'
      }
    , 'yp-loader': {
        js: '../yp/lib/yp-loader'
      }
    , 'mvvm': {
        js: '../yp/lib/avalon.mobile'
      }
    , 'common': {
        js: '../common'
      , shim: [
          'bootstrap'
        , 'jquery-ui'///
        , 'modernizr'///
        , 'selectpicker'
        , 'uniform'
        , 'switch'
        , 'notyfy'
        , 'bootbox'///
        ///, 'resize'
        ]
      }
    , 'bootstrap': {
        js: [
          'http://cdn.staticfile.org/twitter-bootstrap/3.0.3/js/bootstrap.min'
        , '../../../../bootstrap/js/bootstrap.min'
        ]
      ///, css: ['../../../../bootstrap/css/bootstrap.min']
      , jq: ['tooltip', 'popover']
      , shim: ['uniform']
      }
    , 'jquery-ui': {
        js: '../../plugins/system/jquery-ui/js/jquery-ui-1.9.2.custom.min'
      , css: ['../../plugins/system/jquery-ui/css/smoothness/jquery-ui-1.9.2.custom.min']
      , jq: ['datepicker', 'sortable']
      }
    , 'modernizr': {
        js: '../../plugins/system/modernizr'
      }
    , 'slimScroll': {
        js: '../../plugins/system/slimScroll'
      , jq: []
      }
    , 'bootbox': {
        js: '../../../../bootstrap/extend/bootbox'
      }
    , 'notyfy': {
        js: '../../plugins/notifications/notyfy/jquery.notyfy'
      , css: [
          '../../plugins/notifications/notyfy/jquery.notyfy'
        , '../../plugins/notifications/notyfy/themes/default'
        ]
      }
    , 'selectpicker': {
        js: '../../../../bootstrap/extend/bootstrap-select/bootstrap-select'
      , css: ['../../../../bootstrap/extend/bootstrap-select/bootstrap-select']
      , jq: []
      }
    , 'switch': {
        js: '../../../../bootstrap/extend/bootstrap-switch/static/js/bootstrap-switch.min'
      , css: ['../../../../bootstrap/extend/bootstrap-switch/static/stylesheets/bootstrap-switch']
      , jq: []
      }
    , 'dataTable': {
        js: '../../plugins/tables/DataTables/media/js/jquery.dataTables.min'
      , jq: ['dataTable', 'sortable']///
      ///, shim: ['pagination']
      }
    , 'pagination': {
        js: '../../plugins/pagination/pagination'
      }
    , 'dataTable_plus': {
        js: '../../plugins/tables/DataTables/media/js/DT_bootstrap'
      , shim: ['dataTable']
      }
    , 'datetimepicker': {
        js: '../../plugins/forms/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min'
      }
    , 'uniform': {
        js: '../../plugins/forms/pixelmatrix-uniform/jquery.uniform.min'
      ///, css: ['../../plugins/forms/pixelmatrix-uniform/css/uniform.default']
      , jq: []
      }
    , 'resize': {
        js: '../../plugins/other/jquery.ba-resize'
      }
    , 'sticky': {
        js: 'jquery.pin'
      }
    , 'prettify': {
        js: '../../plugins/other/google-code-prettify/prettify'
      , css: ['../../plugins/other/google-code-prettify/prettify']
      }
    , 'tree': {
        js: 'zTree/js/jquery.ztree.all-3.5.min'
      , css: ['zTree/zTreeStyle/zTreeStyle']
      }
    , 'editor': {
        js: 'editor/kindeditor/kindeditor'
      }
    /*, 'prettyPhoto': {
        js: ''
      , css: ['../../plugins/gallery/prettyphoto/css/prettyPhoto']
      , jq: []
      }
    , 'toggleButtons': {
        js: ''
      , jq: []
      }*/
    }
  };

  // 文件资源配置
  api.baseUrl = api.baseUrl || '../';
  api.loader = {
    require: {
      // 统一文件版本号（也可对特殊模块做单独配置）
      urlArgs: 'v=' + (+new Date() || yp.fn.yp)
    , paths: {}
    , shim: {}
    }
    // 默认加载列表
  , baseList: ['yp-loader', 'yp-ui', 'yp-mods', 'yp-loger', 'yp-cache', 'common', 'mvvm', 'prettify']
    // 表单异步提交默认参数
  , data_pre: 'doSubmit=1'
  };
  // 各类型文件目录配置
  api.loader.baseUrlList = {
    js: api.baseUrl + 'lib'
  , css: api.baseUrl + 'lib/'
  , html: api.baseUrl + 'h/'
  };
  api.loader.require.baseUrl = api.loader.baseUrlList.js;
  api.loader.debug = api.debug || true;

  api.test = false;///

}(this);