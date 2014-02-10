


// $('#submit_btn').click(function() {
// 	var parentIframe = $($('iframe')[0].contentWindow.document.body);
// 	var previewIframe = $(parentIframe.find('#epiceditor-previewer-frame')[0].contentWindow.document.body);
// 	parentIframe.find('.epiceditor-toggle-preview-btn').trigger('click');

// 	var htmlContent = previewIframe.find('#epiceditor-preview').html();

// 	$('#messageContent').val(htmlContent);
// })

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
});