chrome.contextMenus.create({
	title: "抓取图文",
	onclick: function () {
		// chrome.tabs.create({url: 'chrome://extensions/jgjhfjdmeojmcdnejekmdpfldfolohpg/deeimg.html'});
		// chrome.tabs.create(chrome.extension.getURL('deeimg.html'));
		// window.open(chrome.extension.getURL('deeimg.html'));

		sendMessageToContentScript({ cmd: 'spider_img', msg: 'hello content, come from background order' }, (response) => {
			if (response) {
				console.log('收到来自content-script的回复：' + response);
			}
		});
	}
});

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
	getCurrentTabId((tabId) => {
		chrome.tabs.sendMessage(tabId, message, function (response) {
			if (callback) callback(response);
		});
	});
}

// 获取当前选项卡ID
function getCurrentTabId(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (callback) callback(tabs.length ? tabs[0].id : null);
	});
}

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.cmd == 'ware_json') {
		console.log(request.msg);
		storeUserPrefs(request.msg);
		window.open(chrome.extension.getURL('deeimg.html'));
	}
});

function storeUserPrefs(deePrefs) {
	var key = 'deeJsonKey';
	chrome.storage.sync.set({ [key]: deePrefs }, function () {
		console.log('Saved', key, deePrefs);
	});
}