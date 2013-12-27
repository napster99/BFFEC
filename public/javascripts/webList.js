//@charset 'utf-8';
/*
 * 管理员审核日报页
 */

$(function() {
  var ui = {
    $startPassBtn : $('button[name=startPassBtn]'),
    $passBtn : $('#passBtn'),
    $unPassBtn : $('#unPassBtn'),
    $backBtn : $('#backBtn'),
    $msgCon : $('#msgCon'),
    $msgList : $('#msgList'),
    $msgDetail : $('#msgDetail'),
    $reviews : $('#reviews'),
    $score : $('#score'),
    $logPagina : $('#logPagina'),
    $logContent : $('#logContent')
  }

  var Page = {
    init : function(){
      var self = this;
      this.view();
      this.addEventListener();
      this.initJsChart();
      this.getLogScoreAjax();
    },
    view : function() {



      

        
    },
    addEventListener : function() {
      var self = this;
      ui.$startPassBtn.on('click','',function() {
        var mid = $(this).attr('mid');
        self.getDailyDetail(mid);
      });
      //通过
      ui.$passBtn.on('click','',function() {
        var mid = ui.$msgDetail.attr('mid');
        var uid = ui.$msgDetail.attr('uid');
        var reviews = ui.$reviews.val().replace(/\s*/g,'');
        var score = ui.$score.val();
        if(!/^[0-9]*[1-9][0-9]*$/.test(score)) {
          alert('请输入正整数的积分！');
          ui.$score.val('').focus();
          return;
        }
        self.changeMessageStatus(mid,'passed',uid,reviews,score);
      });
      //不通过
      ui.$unPassBtn.on('click','',function() {
        var mid = ui.$msgDetail.attr('mid');
        var uid = ui.$msgDetail.attr('uid');
        var reviews = ui.$reviews.val().replace(/\s*/g,'');
        var score = ui.$score.val();
        self.changeMessageStatus(mid,'unpass',uid,reviews,score);
      });
      //返回列表
      ui.$backBtn.on('click','',function() {
        ui.$msgDetail.hide();
        ui.$msgList.show();
      })
    },

    changeMessageStatus : function(mid,status,uid,reviews,score) {
      var options = {
        'url' : '/changeMessageStatus',
        'dataType' : 'json',
        'type' : 'POST',
        'data' : {mid : mid,status : status ,uid : uid,reviews:reviews,score:score},
        'success' : function(data) {
          console.log(data)
          if(data['message'] == 'success') {
            window.location.href = window.location.href;
          }
        },
        'error' : function(err) {
          
        }
      }
      $.ajax(options);
    },

    getDailyDetail : function(mid) {
      var self = this;
      var options = {
        'url' : '/getDailyDetailForPass',
        'dataType' : 'json',
        'type' : 'GET',
        'data' : {mid : mid },
        'success' : function(data) {
          self.renderList(data);
        },
        'error' : function(err) {
          console.log(err)
        }
      }
      $.ajax(options);
    },
    renderList : function(data) {
      var html = '',uname = data['uname'],message = data['message'];
      html += '<h3>'+message['mtitle']+'</h3>'
      +'<hr>'
      +'<div class="topic_content"> '
      +'    <div class="well"> '+message['mcontent'] + '</div>'
      +'</div>'
      +'<hr>'
      +'<div class="changes"> '
      +'     <span class="col_fade"> '
      +'          <a class="dark" href="javascript:;">'+uname+'</a> 在 '+message['mtime']+' 发布 '
      +'     </span>'
      +'</div>';
      ui.$msgCon.html(html);
      ui.$msgDetail.attr('mid',message['_id']).attr('uid',message['uid']);
      ui.$msgList.hide();
      ui.$msgDetail.show();
    },

    initJsChart : function() {
      var options = {
        'url' : '/getRanking',
        'dataType' : 'json',
        'type' : 'GET',
        'success' : function(data) {
          var usersArr = [],colorsArr = [];
          for(var i=0; i<data.length; i++) {
            usersArr.push([data[i]['name'] || '--' ,data[i]['score']]);
            colorsArr.push('#81C714');
          }
          // var colors = ['#AF0202', '#EC7A00', '#FCD200', '#81C714'];
          var myChart = new JSChart('graph', 'bar');
          myChart.setDataArray(usersArr);
          myChart.colorizeBars(colorsArr);
          myChart.setTitle('成员积分排行榜');
          myChart.setTitleColor('#8E8E8E');
          myChart.setAxisNameX('');
          myChart.setAxisNameY('%');
          myChart.setAxisColor('#C4C4C4');
          myChart.setAxisNameFontSize(16);
          myChart.setAxisNameColor('#999');
          myChart.setAxisValuesColor('#7E7E7E');
          myChart.setBarValuesColor('#7E7E7E');
          myChart.setAxisPaddingTop(60);
          myChart.setAxisPaddingRight(140);
          myChart.setAxisPaddingLeft(150);
          myChart.setAxisPaddingBottom(40);
          myChart.setTextPaddingLeft(105);
          myChart.setTitleFontSize(11);
          myChart.setBarBorderWidth(1);
          myChart.setBarBorderColor('#C4C4C4');
          myChart.setBarSpacingRatio(50);
          myChart.setGrid(false);
          myChart.setSize(616, 321);
          myChart.draw();
          
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
    getLogScoreAjax : function(curPage) {
      var self = this;
      var options = {
        'url' : '/getLogScoreAjax',
        'dataType' : 'json',
        'type' : 'GET',
        'data' : {curPage : curPage||1},
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
    renderLogScoreList : function(data){
      var html = "";
      for(var i=0,len=data.length; i<len; i++) {
        html += '<tr uid="'+data[i]['uid']+'">'
        +'<td>'+data[i]['name']+'</td>'
        +'<td>通过'+CommonJS.logsType[data[i]['type']]+'</td>'
        +'<td>'+data[i]['score']+'分</td>'
        +'<td>'+CommonJS.changeTime(data[i]['time'],'yyyy-MM-dd HH:mm:ss')+'</td>'
        +'</tr>';
      }
      ui.$logContent.html(html);
    }
  }

  Page.init();

});


                
                  
                
                
                    
                        
                    
                
                
             