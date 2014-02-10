//@charset 'utf-8';
/*
 * 个人话题列表页
 */

$(function() {
  var ui = {
    $topicContent : $('#topicContent'),
    $topicPagina : $('#topicPagina')
  }

  var uid = $('#uid').val();
  var avatar = $('#avatar').val();

  var Page = {
    init : function(){
      var self = this;
      this.view();
      this.addEventListener();
      this.getLogTopicAjax();
    },
    view : function() {
      
    },

    addEventListener : function() {
      
    },

    getLogTopicAjax : function(curPage) {
      var self = this;
      var options = {
        'url' : '/getLogTopicAjax',
        'dataType' : 'json',
        'type' : 'GET',
        'data' : {curPage : curPage||1,uid : uid},
        'success' : function(data) {
          if(data['data'].length > 0) {
            self.renderPagi(data['page'],data['totalPages']);
            self.renderTopicList(data['data']);  
          }else{
            ui.$topicContent.html('<tr><td>暂无话题</td></tr>');
            ui.$topicPagina.hide();
          }
        },
        'error' : function(err) {
          console.log(err)
        }
      }
      $.ajax(options);
    },

    //个人话题列表分页
    renderPagi : function(page,totalPages,which) {
      var self = this;
       var options = { 
            currentPage: page || 1, 
            totalPages: totalPages, 
            numberOfPages:5, 
        onPageClicked : function(event,originalEvent,type,page) { 
            var tid = $(this)[0].id;
            self.getLogTopicAjax(page);
          } 
      } 
      ui.$topicPagina.show();
      ui.$topicPagina.bootstrapPaginator(options); 
    },

    renderTopicList : function(data){
      var html = "";
       for(var i=0; i<data.length; i++) {
        html += '<div class="cell"> '
        +'<div class="user_avatar block"> '
        +'<a target="_blank" href="javascript:;"> '
        +'<img src="'+avatar+'"> '
        +'</a> '
        +'</div> '
        +'<div class="topic_wrap" style="padding-left:15px;"> '
        +'<a target="_blank" href="/topic/'+data[i]['_id']+'"> '
        + data[i]['mtitle']
        +'</a></div><div class="last_time">'+data[i]['mtime']+'</div> </div> '
       }
      
      ui.$topicContent.html(html);
    }

  }

  Page.init();

});


                
                  
                
                
                    
                        
                    
                
                
             