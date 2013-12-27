/* 
 * 发表日报 周报页面JS
 */
(function() {
	var curTime = new Date();
	curTime = curTime.format('yyyy/MM/dd');
	KindEditor.ready(function(K) {
		var editor = K.create('textarea[name="content"]', {
			allowFileManager : true
		});
		$('#submit_btn').click(function() {
			if($('#title').val().replace(/\s*/g,'') === '') {
				$('#title').val('《'+curTime+'的日报》');
			}
		});
	});
	
	$('#title').attr('placeholder','默认为《'+curTime+'的日报》');

	$('input[name=which]').click(function() {
		var which = this.id;
		if(which == 'rb') {
			//日报
			$('#baoTitle').text('发表日报');
			$('#title').attr('placeholder','默认为《'+curTime+'的日报》');
			// if($('#title').val().replace(/\s*/g,'') === '') {
			// 	$('#title').val('《'+curTime+'的日报》');
			// }

		}else{
			//周报
			$('#baoTitle').text('发表周报');
			$('#title').attr('placeholder','默认为《'+curTime+'的周报》');
			// if($('#title').val().replace(/\s*/g,'') === '') {
			// 	$('#title').val('《'+curTime+'的周报》');
			// }
		}
	})


})();



