function sendMessageToContentScriptByPostMessage(data) {
    if (data && data.cmd == 'spider_dee_msg') {
        getDeeWareMag();
    } else if (data && data.cmd == 'cal_price') {
        getPrice();
    }
}

window.addEventListener("message", function (e) {
    if (e.data && e.data.cmd == "cal_price") {
        console.log(e.data.msg);
        getPrice();
    } else {

    }

}, false);

function getPrice() {
    var postage = $("div.obj-carriage").find("em.value").text();

    if (!parseFloat(postage)) {
        postage = 0;
    }
    var tPrice;
    var sPrice;
    if (iDetailData.sku.price == "") {
        var pr = iDetailData.sku.priceRange;
        var dp = pr[0][1];
        if (pr.length > 1) {
            var up = pr[pr.length - 1][1];
            tPrice = "" + ((parseFloat(postage) + parseFloat(dp)) / 0.8) + " - " + ((parseFloat(postage) + parseFloat(up)) / 0.8);
            sPrice = "" + ((parseFloat(postage) + parseFloat(dp)) / 0.8 + 5) + " - " + ((parseFloat(postage) + parseFloat(up)) / 0.8 + 5);
        } else {
            tPrice = "" + ((parseFloat(postage) + parseFloat(dp)) / 0.8);
            sPrice = "" + ((parseFloat(postage) + parseFloat(dp)) / 0.8 + 5);
        }

    } else {
        var pr = iDetailData.sku.price + "";
        var index = pr.indexOf('-');
        if (index != -1) {
            var dp = pr.slice(0, index);
            var up = pr.slice(index + 1, pr.length);
            tPrice = "" + ((parseFloat(postage) + parseFloat(dp)) / 0.8) + " - " + ((parseFloat(postage) + parseFloat(up)) / 0.8);
            sPrice = "" + ((parseFloat(postage) + parseFloat(dp)) / 0.8 + 5) + " - " + ((parseFloat(postage) + parseFloat(up)) / 0.8 + 5);
        } else {
            tPrice = "" + ((parseFloat(postage) + parseFloat(pr)) / 0.8);
            sPrice = "" + ((parseFloat(postage) + parseFloat(pr)) / 0.8 + 5)
        }
    }

    console.log(tPrice);
    console.log(sPrice);

    $("#dee_t_price").text(tPrice);
    $("#dee_s_price").text(sPrice);
}

function getPostage(params) {
    var postageUrl = "https://laputa.1688.com/offer/ajax/CalculateFreight.do?"
        + "jsonp=jQuery17207645211706243538_1528957837168&price=460&templateId=3422786&memberId=pujianyutai&volume=0"
        + "&offerId="
        + params
        + "&flow=general&excludeAreaCode4FreePostage=ALL&countryCode=1001&provinceCode=1098&cityCode=1099"
    $.ajax({
        url: postageUrl,
        dataType: "jsonp",
        crossDomain: true,
        // async: true,
        // data: { "id": "value" },
        type: "GET",
        beforeSend: function () {

        }, success: function (req) {
            console.log(req);
        }, complete: function () {

        }, error: function () {

        }
    });
}

function getDeeWareMag() {
    var pattern = /[0-9]\d*/,
        str = location.pathname;
    var pm = str.match(pattern);
    //d1688url
    console.log(pm[0]);
    //mod-detail-title
    var title = $("#mod-detail-title").children("h1").text();
    console.log("title: " + title);

    //mod-detail-gallery
    // var bannerImgs = "";
    var bannerImgs = [];
    $("div.tab-content-container").find("li").each(function (index, element) {
        var tem = JSON.parse($(element).attr("data-imgs"));
        // bannerImgs += tem.original + ";";
        bannerImgs[index] = tem.original;
    });
    console.log("bannerImgs: " + bannerImgs);

    //mod-detail-postage
    var postage = $("div.obj-carriage").find("em.value").text();
    console.log("postage: " + postage);

    // var sm = JSON.parse(iDetailData);
    var skuMap = iDetailData.sku.skuMap;
    var searchMap = new Map();
    var skuProps = iDetailData.sku.skuProps;
    var c0List = skuProps[0].value;
    var c1List = skuProps[1].value;
    for (let i = 0; i < c0List.length; i++) {
        var c0p = c0List[i].name;
        for (let j = 0; j < c1List.length; j++) {
            var c1p = c1List[j].name;
            searchMap.set(c0p + "&gt;" + c1p, skuProps[0].prop + ":" + c0p + "GODUSEVPN" + skuProps[1].prop + ":" + c1p);
        }
    }
    var temSkuProps = JSON.stringify(skuMap);
    for (let [key, value] of searchMap.entries()) {
        temSkuProps = temSkuProps.replace(key, value);
    }
    skuMap = JSON.parse(temSkuProps);

    //mod-detail-description
    var descJson = $("#mod-detail-description").attr("data-mod-config");
    var oobj = JSON.parse(descJson);
    var detailUrl;
    if (!oobj.catalog) {
        detailUrl = $("#desc-lazyload-container").attr("data-tfs-url");
    } else {
        detailUrl = oobj.catalog[0].contentUrl;
    }


    console.log("desc-url: " + detailUrl);
    // https://img.alicdn.com/tfscom/TB1WM8luKOSBuNjy0FdXXbDnVXa
    $.ajax({
        url: detailUrl,
        // dataType: "jsonp",
        // crossDomain: true,
        // async: true,
        // data: { "id": "value" },
        // headers: {
        //     "Access-Control-Allow-Origin": "https://detail.1688.com"
        //     },
        type: "GET",
        beforeSend: function () {

        }, success: function (req) {
            // var detailImgs = "";
            var detailImgs = [];
            var imgReg = /<img.*?(?:>|\/>)/gi;
            // var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
            var arr = req.match(imgReg);
            for (var i = 0; i < arr.length; i++) {

                var pattern = /https?:\/\/.+\.(jpg|gif|png)/, str = arr[i];
                var src = str.match(pattern);
                // detailImgs += src[0] + ";"
                detailImgs[i] = src[0];

            }
            console.log("detailImgs" + detailImgs);

            var xxmsg = {
                shopId: 3,
                product_title: title,
                d1688url: pm[0],
                carouselPhoto: bannerImgs,
                large: bannerImgs[0],
                thumbnail: bannerImgs[0],
                thumbnail_hd: bannerImgs[0],
                postage: postage,
                skuProps: skuProps,
                skuMap: skuMap,
                detailPhoto: detailImgs
            }
            console.log(xxmsg);
            console.log(JSON.stringify(xxmsg));

            var xcmsg = {
                type: 'image',
                iconUrl: 'img/dayu_launcher.png',
                title: title,
                message: "",
                contextMessage: "",
                imageUrl: bannerImgs[0]
            };

            // showNotifice(xcmsg);

            // postMsgtoBMS(JSON.stringify(xxmsg));

            window.postMessage({
                cmd: 'post_msg',
                msg: xxmsg
            }, '*');

        }, complete: function () {

        }, error: function () {

        }
    });

    //mod-detail-purchasing
    //mod-detail-attributes
    //mod-detail-video

    // window.postMessage({
    //     cmd: 'sp_msg',
    //     msg: xxmsg
    // }, '*');
}

function showNotifice(xcmsg) {
    window.postMessage({
        cmd: 'sp_notice_msg',
        msg: xcmsg
    }, '*');

    //  window.postMessage({
    //     cmd: 'sp_msg',
    //     msg: xcmsg
    // }, '*');
}
