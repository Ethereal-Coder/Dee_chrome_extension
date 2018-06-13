$(function () {
    chrome.storage.sync.get("deeJsonKey", function (obj) {
        $(".deeppp").text(JSON.stringify(obj));
    });
   
});