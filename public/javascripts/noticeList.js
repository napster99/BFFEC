//@charset 'utf-8';
/*
 * 我的消息页
 */

$(function() {
  var ui = {
    $noticeList : $('#noticeList'),
    $logPagina : $('#logPagina'),
    $topicWrap : $('.topic_wrap')
  }

  var uid = $('input[name=uid]').val();
  var curPage = 1;

  var Page = {
    init : function(){
      var self = this;
      this.view();
      this.listen();
      this.getNoticeAjax();
    },
    view : function() {

    },
    listen : function() {
      var self = this;
      $(document).on('click','.topic_wrap',function() {
          var cid = $(this).attr('id');
          var content = $(this).html();
          // $('#myModal').find('.modal-body').html(content);
          // $('#myModal').modal();
          bootbox.alert(content,function() {
            self.updateNoticeStatus(cid);  
            self.showTip();
          })
      });
    },

    updateNoticeStatus : function(cid) {
      var self = this;
      var params = {
        'conditionObj' : {
          '_id' : cid
        },
        'fieldObj' : {
          'isRead' : true
        }
      }
      var options = {
        'url' : '/data/notice/edit',
        'dataType' : 'json',
        'type' : 'POST',
        'data' : params,
        'success' : function(data) {
          if(data['code'] == '1') {
            self.getNoticeAjax(curPage);
          }
        },
        'error' : function(err) {
          console.log(err)
        }
      }
      $.ajax(options);
    },
    
    getNoticeAjax : function(curPage) {
      var self = this;
      var options = {
        'url' : '/getNoticeAjax',
        'dataType' : 'json',
        'type' : 'GET',
        'data' : {curPage : curPage||1,uid : uid},
        'success' : function(data) {
          if(data['data'].length > 0) {
            self.renderPagi(data['page'],data['totalPages']);
            self.renderNoticeList(data['data']);  
          }else{
            ui.$noticeList.html('<tr><td>暂无消息</td></tr>');
            ui.$logPagina.hide();
          }
        },
        'error' : function(err) {
          console.log(err)
        }
      }
      $.ajax(options);
    },

    showTip : function() {
      var options = {
        'url' : '/data/notice/list',
        'dataType' : 'json',
        'type' : 'GET',
        'data' : {'uid':uid,'isRead' : false},
        'success' : function(data) {
          if(data['code'] == '1') {
            if(data['data'] instanceof Array && data['data'].length > 0) {
              $('.notice').show();
            }else{
              $('.notice').hide();
            }
          }
        },
        'error' : function(err) {
          console.log(err)
        }
      }
      $.ajax(options);
    },

    //我的消息分页
    renderPagi : function(page,totalPages,which) {
      var self = this;
       var options = {
           currentPage: page || 1, 
            totalPages: totalPages, 
         numberOfPages:5, 
        onPageClicked : function(event,originalEvent,type,page) { 
            var tid = $(this)[0].id;
            curPage = page;
            self.getNoticeAjax(page);
          } 
      } 
      ui.$logPagina.bootstrapPaginator(options); 
    },

    renderNoticeList : function(data){
      var html = "";
      for(var i=0,len=data.length; i<len; i++) {
        html += '<div class="cell">'
        +'<div class="block count">';
        if(data[i]['isRead']) {
          html += '<span>【已读】</span>'
        }else{
          html +='<span style="display:none;">【已读】</span>'
          +'<span style="color:red;">【未读】</span>';
        }
        html += '</div>'
        +'<div title="点击查看" class="topic_wrap" style="cursor:pointer;" id="'+data[i]['id']+'"> '
        +data[i]['content']
        +'</div>'
        +'<div class="last_time">'+data[i]['time']+'</div> '
        +'</div>'

      }
      ui.$noticeList.html(html);
    }

  }

  Page.init();

});


                
                  
                
                
                    
                        
                    
                
                
             