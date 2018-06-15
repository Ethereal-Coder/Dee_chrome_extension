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

    var content = document.getElementsByClassName('mod-detail-postage');
    for (let a = 0; a < content.length; a++) {
        var element = content[a];
        var xx = element.getAttribute('data-mod-config');
        console.log('xx :   ' + xx);

    }
    // console.log(content);
}

window.addEventListener("message", function (e) {
    console.log(e.data);
    if (e.data && e.data.cmd == "sp_msg") {
        console.log(e.data.msg);
        var xx = {
            cmd: 'ware_json',
            msg: e.data.msg
        };
        sendMessageToBackground(xx);
    } else if (e.data && e.data.cmd == "sp_notice_msg") {
        console.log(e.data.msg);
        sendMessageToBackground(e.data);
    } else if (e.data && e.data.cmd == "post_msg") {
        // postMsgtoBMS(e.data.msg);
        sendMessageToBackground(e.data);
    } else {

    }

}, false);

// var _click = window.onclick;
// window.onclick = function(e){
//     console.log(e.target);
//     _click(e);
// }

document.addEventListener('DOMContentLoaded', function () {



    injectCustomJs();
    if (location.host == 'detail.1688.com') {
        initDeePanel();
        // injectDeePostage();
        simulateClick();
    } else {

    }
});

function simulateClick() {
    // setTimeout(function(){
    //     console.log("location",$('a.parcel-location')[0]);
    //     $('a.parcel-location').trigger('click');

    var run_times = 5;
    var func = function () {
        // alert("ddddd");
        // console.log("直辖市",$(".area-panel-content")[0]);
        run_times--;
        if (run_times < 0) {
            clearInterval(inter);
            noticeRefreshPrice();
            return;
        }

        if ($('a[title=直辖市]').length < 1) {
            return;
        }
        $('a[title=直辖市]').children("span").trigger('click');
        console.log("直辖市", $('a[title=直辖市]')[0]);
        $("a[title=北京]").ready(function () {
            console.log("BJ", $("a[title=北京]").length);
            $("a[title=北京]").html("<span>北京</span>");
            $("a[title=北京]").children("span").trigger("click");
        });

        clearInterval(inter);

        noticeRefreshPrice();
    };

    var inter = setInterval(func, 1000);


    // },2000);
}

function noticeRefreshPrice() {
    setTimeout(() => {
        window.postMessage({
            cmd: 'cal_price',
            msg: "call inject cal price"
        }, '*')
    }, 1000);
}

function injectDeePostage() {
    // var panel = document.createElement('div');
    // panel.className = 'dee_inject_postage';
    // panel.setAttribute('vars_json',"vars");
    // panel.innerHTML = '<h1>hello dayu</h1>';
    // var xx = document.getElementById('offerdetail_ditto_postage_template');
    // xx.appendChild(panel);
    // xx.innerHTML = '<h1>hello dayu</h1>';



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
    // panel.className = 'dee-chrome-extension-panel';
    panel.className = 'widget-custom-container';
    panel.className = 'dee-chrome-extension-panel'
    panel.innerHTML = `
        <h1>大鱼优品</h1>
        <div></div>
        <div id="dee_custom_price" charset=”utf-8″>
        <div><span>团购价：￥ </span><span id="dee_t_price"></span></div>
        <div><span>单买价：￥ </span><span id="dee_s_price"></span></div>
		</div>
		<div class="btn-area">
			<a display="inline-block" href="javascript:sendMessageToContentScriptByPostMessage({
                cmd:'spider_dee_msg',
                msg:'抓取图文'
            })">抓取图文</a><br>
            <a display="inline-block" href="javascript:sendMessageToContentScriptByPostMessage({
                cmd:'cal_price',
                msg:'重算价格'
            })">重算价格</a><br>
		
        </div>
        <h2></h2>
        
    `;

    // document.body.appendChild(panel);
    $("div.offerdetail_ditto_private").html($(panel));
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

