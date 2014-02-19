+function() {
  setTimeout(function() {
    // 模拟ajax请求
    $.ajax = function(url, options) {
      var dfd = $.Deferred()
        , data

      data = [
        {id:1, pId:0, name:'父节点1'}
      , {id:11, pId:1, name:'子节点1'}
      , {id:12, pId:1, name:'子节点2'}
      ];
      setTimeout(function() {
        yp.log('$.ajax', url, options);
        dfd.resolve({code:1, message:'', data:data});
      });
      return dfd;
    };
  });
}();