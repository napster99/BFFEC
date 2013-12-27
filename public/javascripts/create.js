


// $('#submit_btn').click(function() {
// 	var parentIframe = $($('iframe')[0].contentWindow.document.body);
// 	var previewIframe = $(parentIframe.find('#epiceditor-previewer-frame')[0].contentWindow.document.body);
// 	parentIframe.find('.epiceditor-toggle-preview-btn').trigger('click');

// 	var htmlContent = previewIframe.find('#epiceditor-preview').html();

// 	$('#messageContent').val(htmlContent);
// })

KindEditor.ready(function(K) {
	var editor = K.create('textarea[name="content"]', {
		allowFileManager : true
	});
});