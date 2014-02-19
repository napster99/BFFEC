//@charset 'utf-8';
/*
 * 管理员审核日报页
 */

$(function() {
  var ui = {
    // $startPassBtn : $('button[name=startPassBtn]'),
    // $seeDailyBtn  : $('a[name=seeDaily]'),
    $passBtn : $('#passBtn'),
    $unPassBtn : $('#unPassBtn'),
    $backBtn : $('button[name=backBtn]'),
    $msgCon : $('#msgCon'),
    $msgSeeCon : $('#msgSeeCon'),
    $msgList : $('#msgList'),
    $msgDetail : $('#msgDetail'),
    $reviews : $('#reviews'),
    $score : $('#score'),
    $logPagina : $('#logPagina'),
    $logContent : $('#logContent'),
    $dailyStatus : $('#dailyStatus'),
    $dailyCon    : $('#dailyCon'),
    $msgSeeDetail : $('#msgSeeDetail'),
    $dayPagi : $('#dayPagi'),
    $userList : $('select[which=userList]'),   //user list
    $authList : $('#authList'),
    $authSureBtn : $('#authSureBtn')
  }

  var authUid;

  var Page = {
    init : function(){
      var self = this;
      this.addEventListener();
      this.view();
      this.initJsChart();
      this.getLogScoreAjax();
      this.getDailyListByStatus(1);
      this.getUserList();
    },
    view : function() {
      if(window.location.hash) 
        $('.nav-tabs').find('a[href='+window.location.hash+']').trigger('click');
      else 
        $('.nav-tabs').find('a').eq(0).trigger('click');
    },
    addEventListener : function() {
      var self = this;

      $(document).on('click','button[name=startPassBtn]',function() {
        var mid = $(this).attr('mid');
        self.getDailyDetail(mid);
      })

      $(document).on('click','a[name=seeDaily]',function() {
        var mid = $(this).attr('mid');
        self.getDailySeeDetail(mid);
      })
      //通过
      ui.$passBtn.on('click','',function() {
        var mid = ui.$msgDetail.attr('mid');
        var uid = ui.$msgDetail.attr('uid');
        var title = ui.$msgDetail.attr('title');
        var reviews = ui.$reviews.val().replace(/\s*/g,'');
        var score = ui.$score.val();
        if(!/^[0-9]*[0-9][0-9]*$/.test(score)) {
          alert('请输入整数的积分！');
          ui.$score.val('').focus();
          return;
        }

        self.changeMessageStatus(mid,title,'passed',uid,reviews,score);
      });
      //不通过
      ui.$unPassBtn.on('click','',function() {
        var mid = ui.$msgDetail.attr('mid');
        var uid = ui.$msgDetail.attr('uid');
        var title = ui.$msgDetail.attr('title');
        var reviews = ui.$reviews.val().replace(/\s*/g,'');
        var score = ui.$score.val();
        self.changeMessageStatus(mid,title,'unpass',uid,reviews,score);
      });
      //返回列表
      ui.$backBtn.on('click','',function() {
        ui.$msgDetail.hide();
        ui.$msgSeeDetail.hide();
        ui.$msgList.show();
      })


      //日报删选条件
      ui.$dailyStatus.on('change','',function() {
        var status = this.value;
        self.getDailyListByStatus(status);
      });

      $('a[data-toggle=tab]').click(function() {
        if(this.href.indexOf('#lB') > -1) {
            ui.$msgDetail.hide();
            ui.$msgSeeDetail.hide();
            ui.$msgList.show();
        }
      })


      ui.$userList.change(function() {
        if($(this).attr('name') != 'auth') return;
        authUid = $(this).val();
        self.initAuthList(authUid);
      })

      ui.$authSureBtn.click(function() {
        if(!authUid) {
          alert('请选择成员！');
          return;
        }
        var inputs = ui.$authList.find('li input:checked');
        var authArr = [];
        for(var i=0; i<inputs.length; i++) {
          authArr.push(inputs.eq(i).val());
        }
        if(authArr.length == 0) {
          self.resetAuth(authUid);
        }else{
          var obj = {
          'conditionObj' : {
            '_id' : authUid
          },
          'fieldObj' : {
            'auth' : authArr
          }
        }
        self.updateAuthList(obj);
        }
        
      });
    },

    resetAuth : function(uid) {
      var options = {
        'url' : '/resetAuth',
        'dataType' : 'json',
        'type' : 'POST',
        'data' : {'uid' : uid },
        'success' : function() {
            alert('更新成功！')
         }
      }
      $.ajax(options);
    },

    updateAuthList : function(data) {
      var options = {
        'url' : '/data/user/edit',
        'dataType' : 'json',
        'type' : 'POST',
        'data' : data,
        'success' : function() {
            alert('更新成功！')
         }
      }
      $.ajax(options);
    },

    initAuthList : function(uid) {
      var options = {
        'url' : '/data/user/list?_id='+uid,
        'dataType' : 'json',
        'type' : 'GET',
        'success' : function(data) {
          var auth = data['data'][0]['auth'];
          var inputs = ui.$authList.find('li input');
          for(var i=0; i<inputs.length; i++) {
            if(auth.indexOf(inputs.eq(i).val()) > -1) {
              inputs.eq(i).get(0).checked = true;
            }else{
              inputs.eq(i).get(0).checked = false;
            }
          }
        }
      }
      $.ajax(options);
    },

    changeMessageStatus : function(mid,title,status,uid,reviews,score) {
      var options = {
        'url' : '/changeMessageStatus',
        'dataType' : 'json',
        'type' : 'POST',
        'data' : {mid : mid, title: title, status : status ,uid : uid,reviews:reviews,score:score},
        'success' : function(data) {
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
      ui.$msgDetail.attr('mid',message['_id']).attr('uid',message['uid']).attr('title',message['mtitle']);
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
          myChart.setAxisNameY('积分');
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
          myChart.setSize(800, 321);
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
        +'<td>'+CommonJS.logsType[data[i]['type']]+'</td>'
        +'<td>'+data[i]['totalScore']+'分</td>'
        +'<td>'+data[i]['score']+'分</td>'
        +'<td>'+data[i]['mark']+'</td>'
        +'<td>'+data[i]['time']+'</td>'
        +'</tr>';
      }
      ui.$logContent.html(html);
    },

    getDailyListByStatus : function(status,curPage) {
      var self = this;
      var options = {
        'url' : '/getDailyListByStatus',
        'dataType' : 'json',
        'type' : 'GET',
        'data' : {status : status,curPage : curPage || 1},
        'success' : function(data) {
          self.renderDailyList(data['data'],status);
          if(data['totalPages'] > 0)
          self.renderDailyPagi(data['page'],data['totalPages'],status);
        },
        'error' : function(err) {
          
        }
      }
      $.ajax(options);
    },

    //日报列表分页
    renderDailyPagi : function(page,totalPages,status) {
      var self = this;
       var options = { 
           currentPage: page || 1, 
            totalPages: totalPages, 
         numberOfPages:5, 
        onPageClicked : function(event,originalEvent,type,page) { 
            var tid = $(this)[0].id;
            self.getDailyListByStatus(status,page);
          } 
      } 
      ui.$dayPagi.bootstrapPaginator(options); 
    },

    renderDailyList : function(data,status) {
      var html = '';
      if(data.length == 0) {
         ui.$dailyCon.html('<tr><td colspan="5">暂无相关日报</td></tr>');
         return;
      }
      for(var i=0; i<data.length; i++) {
        html += '<tr>'
        +'<td>'+data[i]['name']+'</td>'
        +'<td>'+data[i]['mtitle']+'</td>'
        +'<td>'+data[i]['mtime']+'</td>';
        if(data[i]['pass'] == 'waiting') {
          html +='<td><button name="startPassBtn"  type="button" class="btn btn-success" mid="'+data[i]['_id']+'">开始审核</button></td>'
        +'</tr>';
        }else{
          html +='<td><a href="javascript:;" name="seeDaily" mid="'+data[i]['_id']+'" class="btn btn-success">点击查看</a></td>'
        +'</tr>';
        }
      }
      ui.$dailyCon.html(html);
    },

    getDailySeeDetail : function(mid) {
      var self = this;
      var options = {
        'url' : '/getDailyDetailForPass',
        'dataType' : 'json',
        'type' : 'GET',
        'data' : {mid : mid },
        'success' : function(data) {
          self.renderSeeList(data);
        },
        'error' : function(err) {
          console.log(err)
        }
      }
      $.ajax(options);
    },

    renderSeeList : function(data) {
      var html = '',uname = data['uname'],message = data['message'];
      html += '<h3>'+message['mtitle']+'</h3>'
      +'<hr>'
      +'<div class="topic_content"> '
      +'    <div class="well"> '+message['mcontent'] + '</div>'
      +'</div>'
      +'<div class="changes"> '
      +'     <span class="col_fade"> '
      +'          <a class="dark" href="javascript:;">'+uname+'</a> 在 '+message['mtime']+' 发布 '
      +'     </span>'
      +'</div>'
      +'<hr>';
      var replyArr = data['replyArr'];

      if(replyArr.length > 0) {
        $('#commentCon').show();
        $('#commentNum').text(replyArr.length);
      }
      var replyHtml = '';
      for(var i=0; i<replyArr.length; i++) {
        replyHtml += '<div class="cell reply_area reply_item">'
                  +'<div class="author_content">'
                  +'<div class="user_avatar block">'
                  +'<a target="_blank" href="/user/52bd397d75dc0af411000001"><img src="../images/avatar/52bd397d75dc0af411000001.jpg" title="谢武"></a>'
                  +'</div>'
                  +'<div class="user_info">'
                  +'<span class="reply_author"> '
                  +'<a class="dark" href="/user/52bd397d75dc0af411000001">谢武</a> '
                  +'</span>'
                  +'<span class="col_fade">'
                  +'<span>'+new Date(replyArr[i]['rtime']).format('yyyy-MM-dd hh:mm')+'</span>'
                  +'</span> '
                  +'</div>'
                  +'<div class="user_action"> '
                  +'<span class="col_fade">#'+(i+1)+'</span>  '
                  +'</div></div> '
                  +'<div class="reply_content"> '
                  +'<pre>'+replyArr[i]['rcontent']+'</pre>'
                  +' </div></div>  ';
      }

      $('#adminComment').html(replyHtml);
     
      ui.$msgSeeCon.html(html);
      ui.$msgList.hide();
      ui.$msgDetail.hide();
      ui.$msgSeeDetail.show();
    },

    getUserList : function() {
      var self = this;
      var options = {
        'url' : '/data/user/list',
        'dataType' : 'json',
        'type' : 'GET',
        'success' : function(data) {
          if(data['code'] == '1') {
            self.renderUserList(data['data']);
          }
        },
        'error' : function(err) {
          console.log(err)
        }
      }
      $.ajax(options);
    },

    renderUserList : function(data) {
      var html = '<option value="">请选择</option>';
      for(var i=0; i<data.length; i++) {
        html += '<option value="'+data[i]['_id']+'">'+data[i]['name']+'</option>'
      }

      ui.$userList.html(html);
    }


  }

  Page.init();

});

