//@charset 'utf-8';
/*
 * 积分日志页
 */

$(function() {
  var ui = {
    $logContent : $('#logContent'),
    $logPagina : $('#logPagina')
  }

  var uid = $('input[name=uid]').val();

  var Page = {
    init : function(){
      var self = this;
      this.view();
      this.addEventListener();
      this.getLogScoreAjax();
    },
    view : function() {

        
    },
    addEventListener : function() {
      

    },

    
    getLogScoreAjax : function(curPage) {
      var self = this;
      var options = {
        'url' : '/getLogScoreAjax',
        'dataType' : 'json',
        'type' : 'GET',
        'data' : {curPage : curPage||1,uid : uid},
        'success' : function(data) {
          console.log(data)
          if(data['data'].length > 0) {
            self.renderPagi(data['page'],data['totalPages']);
            self.renderLogScoreList(data['data']);  
          }else{
            ui.$logContent.html('<tr><td>暂无积分日志</td></tr>');
            ui.$logPagina.hide();
          }
        },
        'error' : function(err) {
          console.log(err)
        }
      }
      $.ajax(options);
    },

    //积分日志分页
    renderPagi : function(page,totalPages,which) {
      var self = this;
       var options = { 
           currentPage: page || 1, 
            totalPages: totalPages, 
         numberOfPages:5, 
        onPageClicked : function(event,originalEvent,type,page) { 
            var tid = $(this)[0].id;
            self.getLogScoreAjax(page);
          } 
      } 
      ui.$logPagina.bootstrapPaginator(options); 
    },

    renderLogScoreList : function(data){
      var html = "";
      for(var i=0,len=data.length; i<len; i++) {
        html += '<tr uid="'+data[i]['uid']+'">'
        +'<td>'+data[i]['name']+'</td>'
        +'<td>通过'+CommonJS.logsType[data[i]['type']]+'</td>'
        +'<td>'+data[i]['score']+'分</td>'
        +'<td>'+data[i]['time']+'</td>'
        +'</tr>';
      }
      ui.$logContent.html(html);
    }

  }

  Page.init();

});


                
                  
                
                
                    
                        
                    
                
                
             