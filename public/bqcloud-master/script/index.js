//@charset "utf-8";
var colArrs = ['#C9ECF8-#D6F0FA','#C5F7C1-#D0FECB','#F1C3F1-#F5D2F5','#D4CDF3-#DDD9FE','#F8F7B6-#FDFDCB'];
var nickname = '匿名' , account="anonymous", startCount=0, count= 2;


changeBGCol();
loadNewNote();

$('#changeBG').click(function(){
	changeBGCol();
});

function loadNewNote(){
	$('.load').show();
	
	if(navigator.onLine){
		getNoteData();
	}else{
		
	}
	
}


function getNoteData(){
	
	$.ajax({
		url : 'Note.do',
		type : 'post',
		data : {'account':account ,'startCount':startCount,'count':count,'method':'getNote'},
		dataType : 'json',
		success : function(data){
			$('.load').hide();
			
			$.each(data,function(key,val){
				$(val['noteHtml']).insertBefore(getLowHCol().find('.load'));
			});
			
			startCount +=2;
		}
	});
}

function changeBGCol(){
	var secs = $('section');
	for (var i = 0; i < secs.length; i++) {

		var rnum = String(Math.random()*10).split('.')[0] % 5;

		secs.eq(i).css('background',colArrs[rnum].split(
			'-')[1]).find('div.note-t').css('background',colArrs[rnum].split(
			'-')[0]);

	}
}


$('.write a').click(function(){
	
	$('#mask').height($(document).height()).show();
	
	$('#putNote').animate({'top':'10px'},400,function(){
		$('input[name=nickname]').val(nickname);
	});
});



$('#putNote .hd a, #login .hd a').click(function(){
	
	resetLogin();
	
	resetPub();
	
	$('#putNote').animate({'top':'-610px'},400,function(){
		$('#mask').hide();
	});
	$('#login').animate({'top':'-280px'},400,function(){
		$('#mask').hide();
	});
});



$('#quickLogin').click(function(){
	
	$('#mask').height($(document).height()).show();

	$('#login').animate({'top':'100px'},400,function(){
		
	});
});


/**
 * @descrption : 判断出哪一栏最低 
 * @return 	   : $dom-->最低列的jQuery对象
 * @date 	   : 2013-03-08 
 */
function getLowHCol(){
	var lows = [],dom;
	try{
		for(var i=1; i<6; i++){
			try{
				var curCol = $('div[col='+i+']').find('section').last();
				lows[i-1] = curCol.offset().top + curCol.height()+'-'+i;
			}catch(e){
				return $('div[col='+i+']');
			}
		}

		var min = Math.min(lows[0].split('-')[0],lows[1].split('-')[0],lows[2].split('-')[0],
			lows[3].split('-')[0],lows[4].split('-')[0]) || '';	

		for(var i=0; i<5; i++){
			if(min == lows[i].split('-')[0]){
				return $('div[col='+lows[i].split('-')[1]+']') || $('');
			}
		}
	}catch(e){
		console.log("errer:判断出哪一栏最低出错！"+e.message);
	}
	
}


var totalheight = 0;
/**
 * @descrption : 向服务器获取数据
 * @return     : null
 * @date 	   : 2013-03-08 
 */
function loadData()
{

    totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());

  //  console.log($(document).height() +'    '+ totalheight)

    if ($(document).height() <= totalheight){
    	$('.load').show();
        //加载数据
    	
    	getNoteData();
    	

   	//	$(str).insertBefore(getLowHCol().find('.load'));
   		//getLowHCol().find('.load').hide();
		   		
	
	   	
     	

    }

}

/*
 * 1.修改了股灵通原有的bug
2.新版论坛首页，新手指导
3.发布了便签云V1.0版本，希望上线后能够得到大家都认可和使用
4.熟悉淘宝KIssy的架构，运用最新技术解决历史遗留问题
 */


/**
 * @descrption : 单个便签数据格式组装
 * @return     : HTML格式
 * @date 	   : 2013-03-11 
 */
function installHtml(title,content,nickname,date){
	var rnum = String(Math.random()*10).split('.')[0] % 5;
	var str = '<section style="background:'+colArrs[rnum].split('-')[1]+'">'+
		'<div class="note-t" style="background:'+colArrs[rnum].split('-')[0]+'"></div>'+
		'<h2>《'+title+'》</h2>'+
		'<article><pre>'+content+
			'</pre><address>作者：'+nickname+
				'<time datetime="'+date+'">时间：'+date+'</time>'+		
			'</address>'+
		'</article>'+
	'</section>';
	
	return str;
}

/**
 * @descrption : 页面滚动条事件监听
 * @return     : null
 * @date 	   : 2013-03-08 
 */
$(window).scroll( function() {

    loadData();

    var tht = parseFloat($(window).scrollTop());
    if(tht > 200){
    	$("#posTools").show();
    }else{
		$("#posTools").hide();
    }
});


/**
 * @descrption : 发布便签
 * @return     : null
 * @date 	   : 2013-03-10 
 */
function putNote(){
	var title = $('input[name=title]').val(),
		content = $('textarea[name=content]').val(),
		nickname = $.trim($('input[name=nickname]').val()) || '匿名';
	var str = installHtml(title,content,nickname,new Date().format("yyyy-MM-dd"));
	
	if(navigator.onLine){
		//在线的情况下
		//发送到服务器,放入数据库
		//页面重新请求便签，先取最新的前50条
		//每次加载再取后20条
		sendNote(account,str);
	}else{
		//离线的情况下
		alert('离线的情况下')
	}
	
//	getLowHCol().prepend(str);
	$('#putNote .hd a').trigger('click');
}


function sendNote(account,noteHtml){
	console.log(account+'    '+noteHtml);
	$.ajax({
		url : 'Note.do',
		type : 'post',
		data : {'account':account ,'noteHtml':noteHtml,'method':'setNote'},
		dataType : 'text',
		success : function(data){
			//便签重置
			startCount=0;
			//所有便签节点都移除掉
			$('section').remove();
			getNoteData();
		}
	})
}

$('body').keyup(function(event){
	//登录回车
	if($('#login').css('display') == 'block'){
		if((event.keyCode || event.which) == 13){
			if(logCheck()){
				login();
			}
		}
	}
});

$('.foot-bts').find('a').click(function(){
	var name = this.name;
	switch(name){
		case 'pub':
			if(pubCheck()){
				putNote();
			}
			break;
		case 'reset':
			resetPub();
			break;
		case 'login':
			if(logCheck()){
				login();
			}
			break;
		case 'cancel':
			$('#login .hd a').trigger('click');
			break;
		default :
			//do nothing
	}


});

function pubCheck(){
	var retValue = true;
	if($.trim($('input[name=title]').val())== ''){
		$('input[name=title]').addClass('errorstyle');
		retValue = false;
	}
	if($.trim($('textarea[name=content]').val()) == ''){
		$('textarea[name=content]').addClass('errorstyle');
		retValue = false;
	}
	
	return retValue;
}

function logCheck(){
	var retValue = true;
	if($.trim($('input[name=account]').val())== ''){
		$('input[name=account]').addClass('errorstyle');
		retValue = false;
	}
	if($.trim($('input[name=pwd]').val()) == ''){
		$('input[name=pwd]').addClass('errorstyle');
		retValue = false;
	}
	
	return retValue;
}

function resetLogin(){
	$('input[name=account]').val('').removeClass('errorstyle');
	$('input[name=pwd]').val('').removeClass('errorstyle');
	$('.loginError').hide();
}

function resetPub(){
	 $('input[name=title],textarea[name=content]').val('').removeClass('errorstyle');
	 $('input[name=nickname]').val(nickname);
}

/**
 * @descrption : 用户登录
 * @return     : null
 * @date 	   : 2013-03-12 
 */
function login(){
//	$('#loginForm').submit();
	var account = $('input[name=account]').val() || '',
		pwd = $('input[name=pwd]').val() || '';
	try{
		$.ajax({
			url : 'Person.do',
			type : 'post',
			data : {'account':account ,'pwd':pwd,'method':'login'},
			dataType : 'json',
			success : function(data){
				loginCallback(data);
			}
		})
	}catch(e){
		alert(e)
	}
}

function loginCallback(data){
	if(data.id != 0){
		console.log('登录成功！昵称为：'+data.nickname);
		$('strong[name=tip]').text('你好！');
		$('#quickLogin').text(data.nickname).attr('id','nickname');
		$('.write').append('<a name="logout" href="javascript:void(0);">退出</a> ');
		$('#login .hd a').trigger('click');
		$('.write a').css({'display':'inline-block','padding':'0 10px'});
		nickname = data.nickname;
		account = data.account;
		$('a[name=logout]').click(function(){
			$(this).remove();
			$('strong[name=tip]').text('已有账号？');
			$('#nickname').text('马上登录').attr('id','quickLogin');
			$('.write a').css({'display':'block','padding':'0'});
			
			//通知服务器登出
			 nickname = '匿名';
			 account = "anonymous";
		});
	}else{
		console.log('登录失败！');
		$('.loginError').fadeIn('fast');
	}
}



$('input,textarea[name=content]').keyup(function(){
	if($.trim($(this).val()) != '' && $(this).hasClass('errorstyle')){
		$(this).removeClass('errorstyle');
	}
})

//跳到顶部
function posTop(){
	$(document).scrollTop(0);
}
//跳到中部
function posMid(){
	$(document).scrollTop($(document).height()/2);
}
//跳到底部
function posBtm(){
	$(document).scrollTop($(document).height());
}




Date.prototype.format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
	} 

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		}
	} 
	return format; 
} 
	