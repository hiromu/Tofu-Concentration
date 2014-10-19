var highlight = null;

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	if(request.launch) {
		var chars = {};
		$('body').blast({
			delimiter: 'character',
		}).each(function(){
			var key = $(this).text();
			if (key in chars) {
				$([this, chars[key]]).attr('tofu-character', key).text('□').addClass('tofu-hidden');
				delete chars[key];
			} else {
				chars[key] = this;
			}
		})
		
		$('.tofu-hidden').bind('click', function(event) {
			if (highlight == null) {
				highlight = event.target;
				$(highlight).text($(highlight).attr('tofu-character'));
			} else {
				if ($(highlight).attr('tofu-character') == $(event.target).attr('tofu-character')) {
					$([highlight, event.target]).each(function() {
						$(this).text($(this).attr('tofu-character')).removeClass('tofu-hidden').unbind('click');
					});
				} else {
					$(event.target).text($(event.target).attr('tofu-character'));
					
					var target = [highlight, event.target];
					setTimeout(function() {
						$(target).text('□');
					}, 1000);
				}
				
				highlight = null;
			}
		});
	} else {
		$('.tofu-hidden').each(function() {
			$(this).text($(this).attr('tofu-character')).removeClass('tofu-hidden').unbind('click');
		});
	}
	
	sendResponse();
});
