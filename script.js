var highlight = null;
var mistake = 0;
var start = null;
var timer = null;

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
					mistake += 1;
					$('#tofu-mistake').text('mistake: ' + mistake);
					$(event.target).text($(event.target).attr('tofu-character'));
					
					var target = [highlight, event.target];
					setTimeout(function() {
						$(target).text('□');
					}, 1000);
				}
				
				highlight = null;
			}
		});
		
		$('body').append('\
			<div id="tofu-scoreboard" style="position: fixed; top: 20px; right: 20px;">\
				<p id="tofu-clock" style="color: #ffa500; font-size: 25px; text-align: center;">00:00</p>\
				<p id="tofu-mistake" style="color: #a52175; font-size: 18px; text-align: center;">mistake: 0</p>\
			</div>\
		');
		
		mistake = 0;
		start = new Date();
		timer = setInterval(updateTimer, 1000);
	} else {
		$('.tofu-hidden').each(function() {
			$(this).text($(this).attr('tofu-character')).removeClass('tofu-hidden').unbind('click');
		});
		$('#tofu-scoreboard').remove();
		clearTimeout(timer);
	}
	
	sendResponse();
});

function updateTimer() {
	var diff = Math.floor((new Date() - start) / 1000);
	var minutes = Math.floor(diff / 60) < 10? '0' + Math.floor(diff / 60): Math.floor(diff / 60);
	var seconds = diff % 60 < 10? '0' + diff % 60: diff % 60;
	$('#tofu-clock').text(minutes + ':' + seconds);
}
