chrome.contextMenus.create({
	title: "抓取图文",
	onclick: function(){
        chrome.tabs.create({url: 'chrome://extensions/jgjhfjdmeojmcdnejekmdpfldfolohpg/deeimg.html'});
    }
});