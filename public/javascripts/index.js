$(function(){


	function showWhich($cur){
		
		$('.nav').find('li.active').removeClass('active');
		$cur.addClass('active');

	}

	switch(window.location.pathname){
		case '/':
			showWhich($('li[name=index]'));
			break;
		case '/login':
			showWhich($('li[name=login]'));
			break;
		case '/modifyPwd':
			showWhich($('li[name=modifyPwd]'));
			break;
		case '/addUser':
			showWhich($('li[name=addUser]'));
			break;
		case '/addDaily':
			showWhich($('li[name=addDaily]'))；
			break;
		default:
			$('.nav').find('li.active').removeClass('active');
	}
	
	$('.alert').fadeIn(1000,function(){
		var that = this;
		setTimeout(function(){
			$(that).fadeOut(1000);
		},2000);	
	});

});