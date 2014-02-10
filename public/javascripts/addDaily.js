/* 
 * 发表日报 周报页面JS
 */
(function() {
	var curTime = new Date();
	curTime = curTime.format('yyyy/MM/dd');
	KindEditor.ready(function(K) {
			var editor = K.create('textarea[name="content"]', {
				allowFileManager : true,
				items : ['source', '|', 'fullscreen', 'undo', 'redo', 'print', 'cut', 'copy', 'paste',
		'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
		'superscript', '|', 'selectall', '-',
		'title', 'fontname', 'fontsize', '|', 'textcolor', 'bgcolor', 'bold',
		'italic', 'underline', 'strikethrough', 'removeformat', '|', 'advtable', 'hr', 'emoticons', 'link', 'unlink', '|', 'about']
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



