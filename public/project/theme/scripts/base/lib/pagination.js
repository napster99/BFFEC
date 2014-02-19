/*
* jquery 分页插件
*/
+function ($) { "use strict";

  // Pagination CLASS DEFINITION
  // =========================

  var Pagination = function (element, options) {
    this.$element = $(element);
    this.options = options;
    this.init();
  }

  Pagination.DEFAULTS = {
    count: 0  // 总数
  , prePage: 20 // 每页几条
  , curPage: 1  // 当前第几页
  , onPageChange: null // 点击回调
  , defaultUrl: ''  // 链接地址，公共部分
  , urlParam: 'page' // url上，页数的参数
  , prevText: '«' // 上一页的文字
  , nextText: '»' // 下一页的文字
  , showGO: true  // 显示“GO”
  , ellipseText: '...'
  };

  Pagination.prototype = {
    init: function(){
      this.view();
      this.bindEvent();
    }
  , view: function(){
      var self = this
        , opts = self.options;

      // 计算总页数
      opts.totalPage = Math.ceil( opts.count / opts.prePage );
      if(6 >= opts.totalPage){
        opts.showGO = false;
      }

      // 获取分页html
      self.$element.html(self.fGetPagination());
      // self.$element.find('.pageGo').focus();
    }
  , bindEvent: function(){
      var self = this
        , opts = self.options;

      self.$element.on('click', '.pageItem', function(){
        var $this = $(this)
          , $li = $this.closest('li');

        if($li.hasClass('disabled') || $li.hasClass('active')){
          return false;
        }

        if(opts.onPageChange){
          opts.curPage = $li.data('page');
          self.$element.html(self.fGetPagination());
          // self.$element.find('.pageGo').focus();
          opts.onPageChange(opts.curPage, $this.attr('href'));
          return false;
        }

        if(!opts.defaultUrl){
          return false;
        }
      });

      self.$element.on('click', '.btn-go', function(){
        fGo();
      });
      self.$element.on('keyup', '.pageGo', function(e){
        (13 == e.keyCode) && fGo();
      });
      function fGo(){
        var page = self.$element.find('.pageGo').val();
        if(page == opts.curPage){
          return false;
        }
        var url = self.fGetUrl(page);
        if(opts.onPageChange){
          opts.curPage = page;
          self.$element.html(self.fGetPagination());
          // self.$element.find('.pageGo').focus();
          opts.onPageChange(page, url);
          return false;
        }
        window.location.href = url;
      }
    }
    // 返回分页的html
  , fGetPagination: function(){
      var self = this
        , opts = self.options
        , curPage = opts.curPage
        , totalPage = opts.totalPage
        , aStartAndEnd = fGetStartEnd(totalPage, curPage)
        , sLinks = ''  // 链接们的html
        , sGoHtml = ''
        , sPaginationHtml = '';

      function fGetStartEnd(totalPage, curPage){
        var aStartAndEnd = [ +curPage - 2, +curPage + 2 ];
        aStartAndEnd[0] = Math.max( aStartAndEnd[0], 1 );
        aStartAndEnd[1] = Math.min( aStartAndEnd[1], totalPage );

        if(4 > (aStartAndEnd[1] - aStartAndEnd[0]) && 4 < totalPage){
          var sub = 4 - ( aStartAndEnd[1] - aStartAndEnd[0] )
            , i;
          if( 1 == aStartAndEnd[0] ){
            for( i = 0; i < sub; i++ ){
              aStartAndEnd[1]++;
              if( totalPage == aStartAndEnd[1] ){
                break;
              }
            }
          } else if( totalPage = aStartAndEnd[1] ){
            for( i = 0; i < sub; i++ ){
              aStartAndEnd[0]--;
              if( 1 == aStartAndEnd[0] ){
                break;
              }
            }
          }
        }

        return aStartAndEnd;
      }

      /* 组合“页”的html start */
      var prevPage = ( 1 == curPage ) ? 1 : curPage - 1
        , nextPage = ( totalPage == curPage ) ? totalPage : curPage + 1;
      sLinks += '<li data-page="' + prevPage + '" class="' + ( prevPage == curPage ? 'disabled' : '' ) + '"><a class="pageItem" href="' + self.fGetUrl(prevPage) + '">' + opts.prevText + '</a></li>';  // 上一页
      sLinks += '<li data-page="1" class="' + ( 1 == curPage ? 'active' : '' ) + '"><a class="pageItem" href="' + self.fGetUrl(1) + '">' + 1 + '</a></li>';  // 第一页

      (1 < aStartAndEnd[0] - 1) && ( sLinks += '<li><span>' + opts.ellipseText + '</span></li>' )

      for( var i = aStartAndEnd[0]; i < aStartAndEnd[1] + 1; i++ ){ // 页列表
        if(1 == i || totalPage == i){
          continue;
        }
        sLinks += '<li data-page="' + i + '" class="' + ( i == curPage ? 'active' : '' ) + '"><a class="pageItem" href="' + self.fGetUrl(i) + '">' + i + '</a></li>';
      }

      (totalPage > aStartAndEnd[1] + 1) && ( sLinks += '<li><span>' + opts.ellipseText + '</span></li>' )

      sLinks += '<li data-page="' + totalPage + '" class="' + ( totalPage == curPage ? 'active' : '' ) + '"><a class="pageItem" href="' + self.fGetUrl(totalPage) + '">' + opts.totalPage + '</a></li>';  // 最后一页
      sLinks += '<li data-page="' + nextPage + '" class="' + ( nextPage == curPage ? 'disabled' : '' ) + '"><a class="pageItem" href="' + self.fGetUrl(nextPage) + '">' + opts.nextText + '</a></li>';  // 下一页
      /* 组合“页”的html end */

      /* go的html start */
      if(opts.showGO){
        sGoHtml = '<div class="input-group pagination-right">\
                    <input type="text" class="form-control pageGo" value="' + curPage + '" />\
                    <div class="input-group-btn dropup">\
                      <button class="btn btn-default btn-go" type="button">Go!</button>\
                    </div>\
                  </div>';
      }
      /* go的html end */

      sPaginationHtml = '<ul class="pagination">' + sLinks + '</ul>' + sGoHtml;

      return sPaginationHtml;
    }
  , fGetUrl: function(page){
      var self = this;
      if(!self.options.defaultUrl){
        return 'javascript:;';
      }
      return ( -1 == self.options.defaultUrl.indexOf('?') ) ? self.options.defaultUrl + '?' + self.options.urlParam + '=' + page : self.options.defaultUrl + '&' + self.options.urlParam + '=' + page;
    }
  };

  // pagination PLUGIN DEFINITION
  // ==========================

  var old = $.fn.pagination;

  $.fn.pagination = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('pagination')
        , options = $.extend({}, Pagination.DEFAULTS, $this.data(), typeof option == 'object' && option);

      if (!data) $this.data('pagination', (data = new Pagination(this, options)))
    })
  }

  $.fn.pagination.Constructor = Pagination;

  // pagination NO CONFLICT
  // ====================

  $.fn.pagination.noConflict = function () {
    $.fn.pagination = old
    return this
  };

}(window.jQuery);