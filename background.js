var active = null;

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.getSelected(null, function(tab) {
		if (active) {
			active = null;
			chrome.tabs.sendMessage(tab.id, {launch: false}, function(response) {
				chrome.browserAction.setIcon({path: 'icon.png'});
			});
		} else {
			active = tab.id;
			chrome.tabs.sendMessage(tab.id, {launch: true}, function(response) {
				chrome.browserAction.setIcon({path: 'active.png'});
			});
		}
	});
});

chrome.tabs.onActivated.addListener(function(tabInfo) {
	if(active == tabInfo.tabId) {
		chrome.browserAction.setIcon({path: 'active.png'});
	} else {
		chrome.browserAction.setIcon({path: 'icon.png'});
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(active == tabId) {
		active = null;
		chrome.browserAction.setIcon({path: 'icon.png'});
	}
});

chrome.tabs.onRemoved.addListener(function(tabId, changeInfo) {
	if(active == tabId) {
		active = null;
		chrome.browserAction.setIcon({path: 'icon.png'});
	}
});