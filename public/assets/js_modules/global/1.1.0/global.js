/*! global(1.1.0) - JianGang Zhao <zhaojiangang@gmail.com> - 2014-05-14 16:38:55*/
define("global/1.1.0/global", [ "lib/latest/lib", "placeholder", "./ueditor_config" ], function(require, exports, module) {
    var lib = require("lib/latest/lib");
    var global = {};
    require("placeholder")($);
    $("input, textarea").placeholder();
    //载入某条评论
    global.loadComments = function(query_param) {
        $.ajax({
            url: "/comments/list",
            dataType: "html",
            type: "get",
            data: query_param + "&_format=html",
            success: function(data) {
                $("#cmt_loading").hide(10, function() {
                    $("#ajax_list").html($(data).fadeIn(400));
                });
                setTimeout(function() {
                    global.cmtpage();
                }, 1200);
            }
        });
    };
    //滚动到评论表单位置
    global.scroll_to_cmtform = function() {
        var $comment_form = $("#comment_form");
        var scroll_top = $comment_form.offset().top - 32;
        $("html, body").animate({
            scrollTop: scroll_top
        }, function() {});
    };
    //评论分页
    global.cmtpage = function(url) {
        $("div.ui_page a").bind("click", function(e) {
            e.preventDefault();
            $.ajax({
                url: $(this).attr("url"),
                dataType: "html",
                type: "get",
                success: function(data) {
                    var ajax_list = $("#ajax_list").offset().top - 42;
                    $("html, body").animate({
                        scrollTop: ajax_list
                    });
                    $("#ajax_list").html($(data).fadeIn(400));
                    setTimeout(function() {
                        global.cmtpage();
                    }, 200);
                }
            });
        });
    };
    //绑定评论表单
    global.bindCmtForm = function(add_param) {
        var add_param = add_param ? add_param + "&" : "";
        //$('#comment_form').bind("submit", function (e) {
        //e.preventDefault();
        //});
        //为确定按钮绑定登录操作事件
        global.logged_button("cmt_submit_button", function() {
            new lib.ajaxForm($("#comment_form"), {
                dataType: "json",
                submitButton: "cmt_submit_button",
                successLabel: "发表成功",
                callback: function(data) {
                    //清空文本框内容
                    if (typeof ueditor != "undefined") {
                        ueditor.setContent("<p></p>");
                    } else {
                        $("#cmt_textarea").val("");
                    }
                    //载入新评论
                    $.ajax({
                        url: "/comments/getone",
                        dataType: "html",
                        type: "get",
                        data: add_param + "_format=html&id=" + data.comment.id,
                        success: function(html) {
                            $("#nodata_topic").remove();
                            $li = $(html);
                            $("#cmts_pager").before($li);
                            var height = $li.height() + "px";
                            $li.css({
                                opacity: 0,
                                height: 0
                            }).animate({
                                opacity: 1,
                                height: height
                            }, 600);
                        }
                    });
                }
            }).send();
        });
    };
    //引入ueditor配置
    global.ueditor_config = require("./ueditor_config");
    //返回模块
    module.exports = global;
});

define("global/1.1.0/ueditor_config", [], function(require, exports, module) {
    //ueditor默认配置
    var config = {};
    //简单配置
    config.simple = {
        initialStyle: "body{font-size:14px;}p{margin-bottom:10px}",
        toolbars: [ [ "FullScreen", "Undo", "Bold", "ForeColor", "FontSize", "Italic", "StrikeThrough", "Link", "Emotion", "InsertImage", "Attachment", "InsertVideo", "JustifyLeft", "JustifyCenter", "JustifyRight", "ClearDoc", "InsertTable", "DeleteTable", "Source" ] ],
        enterTag: "p",
        initialFrameHeight: 300
    };
    //完全配置
    config.full = {
        initialStyle: "body{font-size:14px;}p{margin-bottom:10px}",
        toolbars: [ [ "FullScreen", "Undo", "Redo", "FontSize", "FontFamily", "ForeColor", "Bold", "Italic", "Underline", "BackColor", "StrikeThrough", "Emotion", "InsertImage", "JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyJustify", "lineheight", "RemoveFormat", "FormatMatch", "PastePlain", "ImageNone", "ImageLeft", "ImageRight", "ImageCenter", "Superscript", "Subscript", "InsertVideo", "Attachment", "Date", "Time", "Map", "Spechars", "InsertTable", "DeleteTable", "MergeRight", "MergeDown", "SplittoRows", "SplittoCols", "SplittoCells", "MergeCells", "InsertCol", "InsertRow", "DeleteCol", "DeleteRow", "InsertParagraphBeforeTable", "InsertUnorderedList", "InsertOrderedList", "horizontal", "indent", "Link", "Unlink", "ClearDoc", "SelectAll", "SearchReplace", "Preview", "Source" ] ],
        initialFrameHeight: 300
    };
    module.exports = config;
});
