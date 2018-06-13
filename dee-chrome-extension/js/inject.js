function sendMessageToContentScriptByPostMessage(data) {
    if (data && data.cmd == 'spider_dee_msg') {
        getDeeWareMag();
    } else {

    }
}

function getDeeWareMag() {
    //mod-detail-title
    var title = $("#mod-detail-title").children("h1").text();
    console.log("title: " + title);
    //mod-detail-description
    var descJson = $("#mod-detail-description").attr("data-mod-config");
    console.log("desc: " + descJson);
    //mod-detail-gallery
    var imgs = [];
    $("div.tab-content-container").find("li").each(function (index, element) {
        console.log(index);
        imgs[index] = $(element).attr("data-imgs");
        console.log("banner: " + $(element).attr("data-imgs"));
    });

    var xxmsg = {
        deetitle : title,
        deedesc : descJson,
        deebanner : imgs,
        deesku : iDetailData
    }

    //mod-detail-postage
    //mod-detail-purchasing
    //mod-detail-attributes
    //mod-detail-video

    window.postMessage({
        cmd: 'sp_msg',
        msg: xxmsg
    }, '*');
}