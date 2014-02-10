//@charset 'utf-8';
/*
 * 修改头像
 */

$(function() {
  var ui = {
    $imgCon : $('#avatar'),
    $myfile : $('#myfile'),
    $chooseBtn : $('#chooseBtn'), //选择按钮
    $sureBtn : $('button[name=sureBtn]'), //确定按钮
    $cancelBtn : $('button[name=cancelBtn]')//取消按钮
  }

  var oldUrl =  ui.$imgCon.attr('src');
  
  var Page = {
    init : function(){
      var self = this;
      this.view();
      this.addEventListener();
    },
    view : function() {


    },
    addEventListener : function() {
      var self = this;
      ui.$myfile.on('change','',function() {
        var reader = new FileReader();
        reader.onload = function( evt ){
          ui.$imgCon[0].src = evt.target.result;  
          ui.$chooseBtn.hide();
          ui.$sureBtn.show();
          ui.$cancelBtn.show();
        }
        reader.readAsDataURL(this.files[0]);
      })

      ui.$cancelBtn.on('click','',function() {

        ui.$imgCon[0].src = oldUrl;

        ui.$sureBtn.hide();
        $(this).hide();
        ui.$chooseBtn.show();
        return false;
      })

      // ui.$myfile.on('click',function() {
      //   var options = {
      //     'url' : '/data/project/add',
      //     'dataType' : 'json',
      //     'type' : 'POST',
      //     'data' : {
            
            
      //     },
      //     'success' : function(data) {
            
      //     },
      //     'error' : function(err) {
            
      //     }
      //   }
      //   $.ajax(options);
      //   return false;
      // })
     
    },

    changeMessageStatus : function(mid,status,uid,reviews,score) {
      var options = {
        'url' : '/changeMessageStatus',
        'dataType' : 'json',
        'type' : 'POST',
        'data' : {mid : mid,status : status ,uid : uid,reviews:reviews,score:score},
        'success' : function(data) {
          if(data['message'] == 'success') {
            window.location.href = window.location.href;
          }
        },
        'error' : function(err) {
          
        }
      }
      $.ajax(options);
    }


  }

  Page.init();

});


                
                  
                
                
                    
                        
                    
                
                
             