/*! global(1.0.0) - JianGang Zhao <zhaojiangang@gmail.com> - 2013-10-13 8:15:30*/
define("global/1.0.0/global-debug", [ "lib/latest/lib-debug", "./comment-debug" ], function(require, exports, module) {
    var lib = require("lib/latest/lib-debug");
    var global = {};
    //网站二级导航菜单
    global.subNav = function() {
        $("#qyer_head_nav_item_yd").hover(function() {
            $(this).addClass("qyer_head_nav_item_current");
            $(this).find(".qyer_head_subnav_bg").show();
        }, function() {
            $(this).removeClass("qyer_head_nav_item_current");
            $(this).find(".qyer_head_subnav_bg").hide();
        });
    };
    //滚动到评论表单位置
    global.scroll_to_position = function(btn_obj, position, speed) {
        var speed = speed || 500;
        $(btn_obj).click(function() {
            $("html,body").animate({
                scrollTop: $(btn_obj === position ? this : position).offset().top
            }, speed);
        });
    };
    //注册滚动到顶部时间
    global.scrollToTop = function() {
        //返回顶部
        var icon = $("<div class='ui_upward_wrapper' id='ui_gotop'><a class='arrow_icon'>回顶部</a></div>");
        icon.appendTo("body");
        var icon_h = icon.innerHeight();
        //获取icon高度
        var doc = $(document);
        var win = $(window);
        var foot = $("div.qyer_footer");
        var foot_h = foot.height();
        var isfoot = foot.length;
        var doc_w = doc.width();
        var left = (doc_w - 980) / 2 + 1040;
        //距离左侧距离
        var right = 10;
        //距离右侧距离
        var doc_h, win_h, top, max_h, scroll_top;
        icon.css({
            left: left,
            right: right
        });
        win.on("scroll", function() {
            doc_h = doc.height();
            win_h = win.height();
            top = win_h - icon_h - 30;
            scroll_top = doc.scrollTop();
            if (isfoot) {
                max_h = doc_h - foot_h - scroll_top;
                top = win_h > max_h ? max_h - icon_h - 30 : top;
            }
            if (scroll_top < 200) {
                icon.fadeOut(250);
            } else if (doc_w > 1200) {
                icon.css({
                    right: "auto",
                    top: top
                }).fadeIn(200);
            } else {
                icon.css({
                    left: "auto",
                    top: top
                }).fadeIn(200);
            }
        });
        icon.click(function() {
            $("body,html").animate({
                scrollTop: 0
            });
        });
    };
    //检测登录状态
    global.check_user = function() {
        $.ajax({
            url: "/users/check_user",
            dataType: "html",
            success: function(res) {
                $("#asynclogininfo").html(res);
            }
        });
    };
    //登录后可以执行的按钮
    global.logged_button = function(btn_id, callback) {
        var btn = $("#" + btn_id);
        if (btn.length) {
            //按钮原本事件
            var button_event = function() {
                if (typeof callback == "function") {
                    try {
                        callback();
                    } catch (ex) {}
                } else if (btn.attr("data-href")) {
                    window.location.href = btn.attr("data-href");
                } else {
                    return false;
                }
            };
            //绑定按钮点击事件，为登录先登录然后执行按钮事件
            btn.click(function() {
                if (!user.uid) {
                    //传递登录后回调方法
                    global.plogin(button_event);
                } else {
                    button_event();
                }
            });
        }
    };
    //弹出登录窗口(登录成功后执行的回调方法)
    global.plogin = function(callback) {
        var strVar = "";
        strVar += '<div class="reg_main">';
        strVar += '  <div class="clearfix"><strong class="fl f16 fontYaHei fb cGray">使用穷游帐号登录</strong><span class="fr cGray">没有帐号？<a id="tab_register_sw" href="javascript:void(0);">立即注册</a></span></div>';
        strVar += '  <form method="post" action="/login" name="loginform" id="login_form">';
        strVar += '    <div class="login_form" style="margin-bottom:10px;">';
        strVar += '      <div class="list clearfix">';
        strVar += '        <span class="fl">帐号：</span>';
        strVar += '        <input type="text" class="ui_input fl" name="login[account]" id="account" maxlength="40" placeholder="邮箱或用户名">';
        strVar += "      </div>";
        strVar += '      <div class="list clearfix">';
        strVar += '        <span class="fl">密码：</span>';
        strVar += '        <input type="password" class="ui_input fl" autocomplete="off" maxlength="16" name="login[password]" id="password">';
        strVar += "      </div>";
        strVar += '      <div class="list clearfix">';
        strVar += '        <label class="fl cGray"><input type="checkbox" checked="checked" id="tagpass" name="login[reme]" class="fl">记住我</label>';
        strVar += '        <a target="_blank" href="getpass" class="fr">忘记密码？</a>';
        strVar += "      </div>";
        strVar += '      <div class="list clearfix">';
        strVar += '        <button type="submit" class="btn btn-mint" id="login_submit_button" style="width:80%;padding:8px 0;font-size:16px">立即登录</button>';
        strVar += "      </div>";
        strVar += "    </div>";
        strVar += "  </form>";
        strVar += '  <div class="tc mt20">';
        strVar += '    <img src="http://static.qyer.com/images/login/login2/huo_icon.png" width="400" height="16" alt=""></div>';
        strVar += '  <div class="clearfix mt15" style="color:#999"><strong>使用以下帐号直接登录</strong></div>';
        strVar += '  <div class="tc mt15">';
        strVar += '    <a href="javascript:void(0);" onfocus="this.blur();" class="weibo_btn _jsweibologin">微博登录</a>';
        strVar += '    <a href="javascript:void(0);" onfocus="this.blur();" class="qq_btn _jsqqlogin">QQ登录</a>';
        strVar += "  </div>";
        strVar += '  <p id="synlogin"></p>';
        strVar += "</div>";
        var popup_login = new lib.popup({
            title: "登陆"
        });
        popup_login.html(strVar, "440", function() {
            setTimeout(function() {
                var $submit_button = $("#login_submit_button");
                $submit_button.prop("type", "submit");
                $("#login_form").submit(function(e) {
                    e.preventDefault();
                    new lib.ajaxForm($(this), {
                        dataType: "json",
                        submitButton: "login_submit_button",
                        successLabel: "登录成功",
                        sendingLabel: "验证中..",
                        errorLabel: "重试登录",
                        callback: function(json_data) {
                            if (json_data.uid && json_data.username) {
                                user = {
                                    uid: json_data.uid,
                                    username: json_data.username
                                };
                                global.check_user();
                                popup_login.close();
                                if (typeof callback == "function") {
                                    try {
                                        callback();
                                    } catch (ex) {}
                                }
                            }
                        }
                    }).send();
                });
            }, 500);
        });
    };
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
        var sub_comment = function() {
            //      $('#comment_form').bind("submit", function (e) {
            //        e.preventDefault();
            //      });
            new lib.ajaxForm($("#comment_form"), {
                dataType: "json",
                submitButton: "cmt_submit_button",
                successLabel: "发表成功",
                callback: function(data) {
                    ueditor.setContent("<p></p>");
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
        };
        this.logged_button("cmt_submit_button", function() {
            console.log("submit comment");
            sub_comment();
        });
        if (!user.uid) {
            //$('#cmt_submit_button').prop('type', 'button');
            $("#cmt_textarea").click(function() {
                global.plogin();
            });
        }
    };
    //1、放大模式
    //学习js方法模式(在不改变原有global类代码的同时，添加一个新方法)
    global = function(obj) {
        //保护realname
        var str = "js方法模式";
        obj.log = function() {
            console.log(str);
        };
        return obj;
    }(global);
    //给global添加新方法,在嵌入式js中可以不污染环境中的变量
    global = function(obj) {
        //保护realname
        var str = "js方法模式2";
        obj.logs = function() {
            console.log(str);
        };
        return obj;
    }(global);
    //2、宽放大模式（Loose augmentation）
    //在浏览器环境中，模块的各个部分通常都是从网上获取的，有时无法知道哪个部分会先加载。如果采用上一节的写法，第一个执行的部分有可能加载一个不存在空对象，这时就要采用"宽放大模式"。
    var global = function(mod) {
        return mod;
    }(global || {});
    global.comment = require("./comment-debug");
    //返回模块
    module.exports = global;
});

//对global进行扩展
define("global/1.0.0/comment-debug", [], function(require, exports, module) {
    var comment = {};
    module.exports = comment;
});
