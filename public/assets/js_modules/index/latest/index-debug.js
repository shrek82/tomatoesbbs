/*! index(1.0.0) - JianGang Zhao <zhaojiangang@gmail.com> - 2013-11-08 22:50:23*/
define("index/latest/index-debug", [ "lib/latest/lib-debug", "jquery_slides/latest/slides_jquery-debug" ], function(require, exports, module) {
    var lib = require("lib/latest/lib-debug");
    require("jquery_slides/latest/slides_jquery-debug")($);
    var index = {};
    module.exports = index;
    //另外一版滚动评论
    index.scrollComments = function(time) {
        var stime = time || 5e3;
        var isIE = !!window.ActiveXObject;
        var isIE6 = isIE && !window.XMLHttpRequest;
        if ($("#citycommentindex ul").attr("name") != "hovered") {
            //判断ul的name属性是否为"hovered"，决定下面代码块是否运行，以实现鼠标经过暂停滚动。
            var height = $("#citycommentindex li:last").height();
            if (isIE6) {
                //判断IE6，jQuery的animate动画和opacity透明在一起使用在IE6中会出现中文重影现象，
                //所以在ie6中实行透明的禁用。
                $("#citycommentindex li:last").css({
                    height: 0
                });
            } else {
                $("#citycommentindex li:last").css({
                    opacity: 0,
                    height: 0
                });
            }
            $("#citycommentindex li:first").before($("#citycommentindex li:last"));
            $("#citycommentindex li").each(function(i) {
                userimgbn = i + 79;
                titlebn = i + 82;
                sitebn = i + 85;
                if (i < 3) {
                    $(this).find("a").each(function(j) {
                        if (j == 0) {
                            $(this).attr("data-bn-ipg", userimgbn);
                        } else if (j == 1) {
                            $(this).attr("data-bn-ipg", titlebn);
                        } else if (j == 2) {
                            $(this).attr("data-bn-ipg", sitebn);
                        }
                    });
                } else {
                    $(this).find("a").each(function(j) {
                        if (j == 0) {
                            $(this).attr("data-bn-ipg", "");
                        } else if (j == 1) {
                            $(this).attr("data-bn-ipg", "");
                        } else if (j == 2) {
                            $(this).attr("data-bn-ipg", "");
                        }
                    });
                }
            });
            //把列表最后的li提升到顶部，实现有限列表项无限循环滚动显示
            $("#citycommentindex li:first").animate({
                height: height
            }, "slow");
            //列表顶部的li高度逐渐变高以把下面的li推下去
            if (!isIE6) {
                $("#citycommentindex li:first").animate({
                    opacity: "1"
                }, "slow");
            }
        }
        setTimeout(index.scrollComments, stime);
    };
    $("#citycommentindex ul").hover(function() {
        $(this).attr("name", "hovered");
    }, function() {
        $(this).removeAttr("name");
    });
    //悬浮登陆框
    var objTop = $("#_jslogintips");
    if (objTop.length > 0) {
        var objTopHeight = objTop.offset().top;
        $(window).scroll(function() {
            var winTop = $(document).scrollTop();
            if (winTop > 0) {
                if (typeof ActiveXObject != "undefined" && typeof XMLHttpRequest == "undefined") {
                    $(".ind_slogan2").css({
                        position: "absolute",
                        top: winTop
                    });
                } else {
                    $(".ind_slogan2").css({
                        position: "fixed",
                        top: objTopHeight
                    });
                }
            } else {
                $(".ind_slogan2").css({
                    position: "",
                    top: ""
                });
            }
        });
    }
    //滚动焦点图
    $("#ind_focus").slides({
        play: 5e3,
        pause: 2500,
        hoverPause: true
    });
});

