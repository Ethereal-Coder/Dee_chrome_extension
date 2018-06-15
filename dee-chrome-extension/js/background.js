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
	}else if(request.cmd == "sp_notice_msg"){
		console.log(request.msg);
		chrome.notifications.create("ware_id", request.msg);
		
	}else if(request.cmd == "post_msg"){
		postMsgtoBMS(request.msg);
	}
});

chrome.notifications.onClicked.addListener(function (id){
	if(id == "ware_id"){
		console.log("ware_id");
		chrome.notifications.create("null", {
			type: 'basic',
			iconUrl: 'img/dayu_launcher.png',
			title: 'hello',
			message: 'hello chrome!'
		});
	}
});


function storeUserPrefs(deePrefs) {
	var key = 'deeJsonKey';
	chrome.storage.sync.set({ [key]: deePrefs }, function () {
		console.log('Saved', key, deePrefs);
	});
}

function postMsgtoBMS(upMsg) {
    var detailUrl = "http://admin-beta.dayuyoupin.com/mobile/" + "saveProductFromMobile";
    var testUrl = "http://192.168.1.94:8081/mobile/" + "saveProductFromMobile";
    // var upMsg = JSON.parse(params);
    chrome.storage.sync.get("deeSelectShop", function (obj) {
        console.log(obj);
        upMsg.shopId = parseInt(obj.deeSelectShop);
		console.log(upMsg.shopId);
		console.log(upMsg);
		console.log(JSON.stringify(upMsg));
        $.ajax({
            url: testUrl,
            data: JSON.stringify(upMsg),
            type: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Basic ZGVlcGJheTpkZWVwYmF5MjAxNw==",
                "token": "125AA9CD290C"
            },
            beforeSend: function () {

            }, success: function (req) {
                console.log(req);
                

            }, complete: function () {

            }, error: function () {

            }
        });
    });

}