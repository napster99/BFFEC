//@charset 'utf-8';

var $ui = $('.breadcrumb').find('li.active');

if(window.location.hash == '#day') {
	$ui.text('日报详情');
}else if(window.location.hash == '#week') {
	$ui.text('周报详情');
}

$(function() {
	var ui = {
		$editBtn : $('#editBtn'),
		$saveBtn : $('#saveBtn'),
		$cancelBtn : $('#cancelBtn'),
		$showArea : $('#showArea'),
		$editArea : $('#editArea'),
		$theContent : $('#theContent')
	}
	var uid = $('#uid').val()
	,mid = $('#mid').val();

	var editor = null;

	var Page = {
		init : function() {
			this.view();
			this.addEventListener();
		},
		view : function() {

			KindEditor.ready(function(K) {
				editor = K.create('textarea[name="content"]', {
					allowFileManager : true,
					height  : '400px'
				});
			});

		},
		addEventListener : function() {
			var self = this;
			ui.$editBtn.on('click','',function() {
				ui.$showArea.hide();
				ui.$editArea.show();
				ui.$saveBtn.show();
				ui.$cancelBtn.show();
				$(this).hide();
				var html = ui.$theContent.val()
				editor.html(html)
			});
			
			//再次提交按钮
			ui.$saveBtn.on('click','',function() {
				self.sendSaveAjax();
			});

			ui.$cancelBtn.on('click','',function() {
				ui.$showArea.show();
				ui.$editArea.hide();
				ui.$saveBtn.hide();
				ui.$cancelBtn.hide();
				ui.$editBtn.show();
			});
		},

		sendSaveAjax : function() {
			var content = editor.html();
			var params = {
				'content' : editor.html(),
				'uid' : uid,
				'mid' : mid
			}
			var options = {
				'url' : '/modifyDaily',
				'dataType' : 'json',
				'type' : 'POST',
				'data' : params,
				'success' : function(data) {
					if(data['message'] === 'success') {
						window.location.reload();
					}
				},
				'error' : function(err) {
					console.log(err)
				}
			}
			$.ajax(options);
		}



 	}

 	Page.init();
});


