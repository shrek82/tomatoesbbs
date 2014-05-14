/*! forum(1.0.0) - JianGang Zhao <zhaojiangang@gmail.com> - 2013-11-15 10:22:04*/
define("forum/latest/forum-debug", [ "lib/latest/lib-debug", "global/latest/global-debug" ], function(require, exports, module) {
    var lib = require("lib/latest/lib-debug");
    var global = require("global/latest/global-debug");
    //论坛方法
    var forums = {};
    //绑定排序功能
    forums.list_events = function() {
        $("#threadtypesmenuorder_fix").hover(function() {
            $("#threadtypesmenuorder_menu").show();
        }, function() {
            $("#threadtypesmenuorder_menu").hide();
        });
        if (window.localStorage) {
            if (typeof localStorage.bbs_forum_list_type !== "undefined") {
                if (localStorage.bbs_forum_list_type == "text") {
                    $("#textlist").removeClass("ontext").addClass("text");
                    $("#piclist").removeClass("pic").addClass("onpic");
                    $(".bbs_threadlist .pics").hide();
                }
                if (localStorage.bbs_forum_list_type == "pic") {
                    $("#piclist").removeClass("onpic").addClass("pic");
                    $("#textlist").removeClass("text").addClass("ontext");
                    $(".bbs_threadlist .pics").show();
                }
            }
        }
        $("#textlist").on("click", function() {
            $(this).removeClass("ontext").addClass("text");
            $("#piclist").removeClass("pic").addClass("onpic");
            $("#threadlist p.pics").animate({
                opacity: "hide",
                height: "hide"
            }, 400);
            if (window.localStorage) {
                window.localStorage.setItem("bbs_forum_list_type", "text");
            }
        });
        $("#piclist").on("click", function() {
            $(this).removeClass("onpic").addClass("pic");
            $("#textlist").removeClass("text").addClass("ontext");
            $("#threadlist p.pics").animate({
                opacity: "show",
                height: "show"
            }, 300);
            if (window.localStorage) {
                window.localStorage.setItem("bbs_forum_list_type", "pic");
            }
        });
    };
    //首页发布新话题按钮
    forums.post_topic = function() {
        var forum_pop = new lib.popup({
            title: "选择要发布到版块："
        });
        forum_pop.ajax("/forums/select_forums", "600", function() {
            setTimeout(function() {
                //绑定tab切换
                $pop_html_box = $("#pop_html_box");
                $pop_html_box_navli = $pop_html_box.find("ul.forumnav li");
                $pop_html_box_list = $pop_html_box.find("div.subcnt ul.list");
                $post_link = $("#post_link");
                var cur_tab;
                $pop_html_box_navli.mouseover(function() {
                    cur_tab = $(this);
                    $(this).addClass("current");
                    $(this).siblings().removeClass("current");
                    $pop_html_box_list.eq(cur_tab.index()).show().siblings().hide();
                });
                //绑定点击
                $pop_html_box_list.find("a").click(function() {
                    //$(this).addClass('current').parent().siblings().find("a").removeClass('current');
                    //$post_link.attr('defid', $(this).attr('fid'));
                    window.location.href = "/forums/topics/post?fid=" + $(this).attr("fid");
                });
                //绑定确定按钮
                $post_link.click(function() {
                    //forum_pop.close();
                    setTimeout(function() {}, 600);
                });
            }, 150);
        });
    };
    //详细页浮动收藏条
    forums.floatTool = function() {
        var $elm = $("#bbs_tools");
        var startPos = $elm.offset().top;
        $(window).on("scroll", function() {
            var p = $(window).scrollTop();
            if (p + 35 > startPos) {
                $elm.css("position", "fixed");
                $elm.css("top", "35px");
            } else {
                $elm.css("position", "static");
                $elm.css("top", "");
            }
        });
    };
    //发布新话题自动扩充文本框
    forums.changeSubject = function() {
        var $form = $("#forum_form");
        $form.find(".base_tab li").click(function() {
            var curlink = $(this).find("a");
            var subject_id = curlink.addClass("cur").attr("sid");
            $form.find("#subject_id").val(subject_id);
            $(this).siblings("li").find("a").removeClass("cur");
            $form.find("ul[subject]").hide();
            $form.find("#subject" + subject_id).show();
        });
    };
    module.exports = forums;
});

