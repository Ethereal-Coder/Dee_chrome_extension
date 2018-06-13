// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
    if (request.cmd == 'spider_img') {
        console.log(request.msg);
        // var xx = {
        //     cmd:'ware_json',
        //     msg:'hello background,come from content json'
        // };
        // sendMessageToBackground(xx);
        getWarejson();


    }

});

var xx = {

}

// 主动发送消息给后台
function sendMessageToBackground(message) {
    chrome.runtime.sendMessage(message, function (response) {

    });
}
function getWarejson() {
    /*  var metas = document.getElementsByTagName('html');
     for (var i = 0; i < metas.length; i++) {
         var element = metas[i];
         console.log(element);
         if (element.getAttribute('property') == 'og:title') {
             var d_title = element.getAttribute('content');
             console.log(d_title);
             break;
         }
 
     } */

    var content = document.getElementsByClassName('mod-detail-postage');
    for (let a = 0; a < content.length; a++) {
        var element = content[a];
        var xx = element.getAttribute('data-mod-config');
        console.log('xx :   '+xx);
        
    }
    // console.log(content);
}

window.addEventListener("message", function (e) {
    if (e.data && e.data.cmd == "sp_msg") {
        console.log(e.data.msg);
        var xx = {
            cmd:'ware_json',
            msg:e.data.msg
        };
        sendMessageToBackground(xx);
    } else {

    }

}, false);

document.addEventListener('DOMContentLoaded', function () {
    injectCustomJs();
    if (location.host == 'detail.1688.com') {
        initDeePanel();
        injectDeePostage();
    } else {

    }
});

function injectDeePostage() {
    var panel = document.createElement('div');
    panel.className = 'dee_inject_postage';
    panel.setAttribute('vars_json',"vars");
    panel.innerHTML = '<h1>hello dayu</h1>';
    var xx = document.getElementById('offerdetail_ditto_postage_template');
    xx.appendChild(panel);
    xx.innerHTML = '<h1>hello dayu</h1>';

    // var zz = document.getElementById('offerdetail_ditto_offerSatisfaction_template');
    // zz.innerHTML('<h1>hello dayu</h1>');

    // var vips = document.getElementsByClassName('detail-vip-login-content');
    // for (let index = 0; index < vips.length; index++) {
    //     var element = vips[index];
    //     element.innerHTML('<h1>hello dayu</h1>');
    // }
      
}

function initDeePanel() {
    var panel = document.createElement('div');
    panel.className = 'dee-chrome-extension-panel';
    panel.innerHTML = `
		<h2>选择需要的操作:</h2>
		<div class="btn-area">
			<a href="javascript:sendMessageToContentScriptByPostMessage({
                cmd:'spider_dee_msg',
                msg:'抓取图文'
            })">抓取图文</a><br>
			<a href="#">hello</a><br>
			
		</div>
		<div id="my_custom_log">
		</div>
	`;
    document.body.appendChild(panel);
}

function injectCustomJs(jsPath) {
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
        // 放在页面不好看，执行完后移除掉
        // this.parentNode.removeChild(this);
    };
    document.body.appendChild(temp);
}