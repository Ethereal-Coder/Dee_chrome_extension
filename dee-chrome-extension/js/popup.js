var divMain = document.getElementsByClassName("wrap-main")[0];
var tags = document.getElementsByClassName("random-div");
var currentSelectShop = document.getElementById("current_select");

$(document).ready(function () {
    getShops();
});

function getShops() {
    var detailUrl = "http://admin-beta.dayuyoupin.com/mobile/" + "getShops";
    var testUrl = "http://192.168.1.94:8081/mobile/" + "getShops";
    $.ajax({
        url: testUrl,
        // data: JSON.parse(params),
        type: "GET",
        headers: {
            // "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Basic ZGVlcGJheTpkZWVwYmF5MjAxNw==",
            "token": "125AA9CD290C"
        },
        beforeSend: function () {

        }, success: function (req) {
            console.log(req);
            chrome.storage.sync.get("deeSelectShop", function (obj) {

                var shopList = req.shops;
                if (shopList.length < 1) return;
                for (let index = 0; index < shopList.length; index++) {
                    var shop = shopList[index];
                    var re = document.createElement("div");
                    re.setAttribute("class", "random-div");
                    re.setAttribute("id", shop.id);
                    re.innerText = shop.name;
                    if (shop.id === parseInt(obj.deeSelectShop)) {
                        re.style.backgroundColor = "#fd6363"
                        re.style.color = "#ffffff"
                        currentSelectShop.innerText = shop.name;
                    }
                    if (index == 0) {
                        if(! parseInt(obj.deeSelectShop)){
                            re.style.backgroundColor = "#fd6363"
                            re.style.color = "#ffffff"
                            currentSelectShop.innerText = shop.name;
                        }
                       
                    }

                    re.onclick = function (ev) {
                        commenStyle(this);

                    }
                    divMain.appendChild(re);

                }
            });


        }, complete: function () {

        }, error: function () {

        }
    });
}

function commenStyle(myElement) {
    console.log(myElement.getAttribute("id"));
    for (var i = 0; i < tags.length; i++) {
        if (tags[i].getAttribute("id") === myElement.getAttribute("id")) {
            myElement.style.color = "#ffffff";
            myElement.style.backgroundColor = "#fd6363";
            currentSelectShop.innerText = myElement.innerText;
            storeUserPrefs(myElement.getAttribute("id"));
        } else {
            tags[i].style.color = "#333333";
            tags[i].style.backgroundColor = "#ececec";
        }
    }
}

function storeUserPrefs(deePrefs) {
    var key = 'deeSelectShop';
    chrome.storage.sync.set({ [key]: deePrefs }, function () {
        console.log('saved', key, deePrefs);
    });
}

