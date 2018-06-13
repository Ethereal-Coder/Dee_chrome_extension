function sendMessageToContentScriptByPostMessage(data) {
    if (data && data.cmd == 'spider_dee_msg') {
        getDeeWareMag();
    } else {

    }
}

function getDeeWareMag() {
    //mod-detail-title
    $("#mod-detail-title")
    //mod-detail-description
    //mod-detail-gallery
    //mod-detail-postage
    //mod-detail-purchasing
    //mod-detail-attributes
    //mod-detail-video



    window.postMessage({
        cmd: 'sp_msg',
        msg: iDetailData
    }, '*');
}