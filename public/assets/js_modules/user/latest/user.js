/*! user(1.0.0) - JianGang Zhao <zhaojiangang@gmail.com> - 2013-11-21 23:40:05*/
define("user/latest/user", [ "lib/latest/lib", "global/latest/global" ], function(require, exports, module) {
    var lib = require("lib/latest/lib");
    var global = require("global/latest/global");
    //用户登录注册等方法
    var user = {};
    module.exports = user;
    //绑定登录
    user.bindLoginForm = function() {
        $("#login_form").bind("submit", function(e) {
            e.preventDefault();
            new lib.ajaxForm("login_form", {
                dataType: "json",
                successLabel: "登录成功",
                sendingLabel: "验证中..",
                errorLabel: "重试登录",
                callback: function() {
                    window.location.href = $("#previous_url").val();
                }
            }).send();
        });
    };
    //注册相关事件
    user.reg = {
        //显示错误
        showError: function(id, text) {
            var obj = $("#" + id);
            obj.parents(".input_div").removeClass("i_focus");
            obj.parents(".input_div").removeClass("index11");
            obj.parents(".input_div").removeClass("i_finish");
            obj.parents(".input_div").removeClass("i_focus");
            obj.parents(".input_div").removeClass("i_loading");
            obj.parents(".input_div").addClass("i_error");
            obj.nextAll(".i_tips").html("<div class='i_jt'>箭头</div>" + text).show();
            setTimeout(function() {
                obj.nextAll(".i_tips").fadeOut(100);
            }, 2e3);
            return false;
        },
        //显示loading
        showloading: function(id) {
            var obj = $("#" + id);
            obj.parents(".input_div").removeClass("i_focus");
            obj.parents(".input_div").removeClass("index11");
            obj.parents(".input_div").removeClass("i_finish");
            obj.parents(".input_div").removeClass("i_focus");
            obj.parents(".input_div").removeClass("i_error");
            obj.parents(".input_div").addClass("i_loading ");
            obj.nextAll(".i_tips").html("").hide();
        },
        //显示成功信息
        showSuccess: function(id) {
            var obj = $("#" + id);
            obj.parents(".input_div").addClass("i_focus");
            obj.parents(".input_div").addClass("index11");
            obj.parents(".input_div").removeClass("i_error");
            obj.parents(".input_div").removeClass("i_loading");
            obj.parents(".input_div").removeClass("i_focus");
            obj.parents(".input_div").addClass("i_finish");
            obj.nextAll(".i_tips").html("").hide();
            return true;
        },
        //显示提示
        showtips: function(id) {
            var obj = $("#" + id);
            if (obj.nextAll(".i_tips").html() != "") {
                obj.nextAll(".i_tips").show();
            }
        },
        //隐藏提示
        hidetips: function(id, id2) {
            var obj = $("#" + id);
            obj.nextAll(".i_tips").hide();
            var obj2 = $("#" + id2);
            obj2.nextAll(".i_tips").hide();
        },
        timeouttips: function(id) {
            var obj = $("#" + id);
            obj.nextAll(".i_tips").hide();
        },
        resetVerify: function() {
            var url = file + "?act=captcha&_";
            $("#refucaptcha").attr("src", function() {
                var t = Math.round(new Date().getTime());
                return url + t;
            });
        },
        //定义输入验证方法
        check: {
            //验证邮箱地址输入
            email: function(email) {
                if (email.length == 0) {
                    user.reg.showError("reg_email", "请输入email");
                    return false;
                }
                user.reg.showloading("reg_email");
                if (email.indexOf("_") == 0) {
                    user.reg.showError("reg_email", "请不要以下划线开头");
                    return false;
                }
                var res = /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
                if (!res.test(email)) {
                    user.reg.showError("reg_email", "email格式不正确");
                    return false;
                }
                $.ajax({
                    url: file + "?act=checkemail",
                    type: "POST",
                    typeDate: "json",
                    data: "email=" + email,
                    success: function(res) {
                        if (res.error) {
                            user.reg.showError("reg_email", res.error);
                            $("#reg_submit").attr("disabled", "disabled").val("请重试");
                            return false;
                        } else {
                            user.reg.showSuccess("reg_email");
                            $("#reg_submit").attr("disabled", false).val("立即注册");
                        }
                    }
                });
                user.reg.showSuccess("reg_email");
                email_is_valid = true;
                return true;
            },
            //验证用户名输入
            username: function(username) {
                var len = $("#reg_username").val().length;
                if (len == 0) {
                    return user.reg.showError("reg_username", "请输入用户名");
                }
                if (len < 3) {
                    return user.reg.showError("reg_username", "用户名最少3个字符");
                }
                for (var i = 0; i < username.length; i++) {
                    var reg = /^[^a-zA-Z0-9_]+$/;
                    if (reg.test(username) && (username.charCodeAt(i) < 19968 || username.charCodeAt(i) > 40869)) {
                        return user.reg.showError("reg_username", "使用中文、英文、数字、下划线,最大15个字符");
                    }
                }
                user.reg.showloading("reg_username");
                if (username.indexOf("_") == 0) {
                    user.reg.showError("reg_email", "请不要以下划线开头");
                    return false;
                }
                name_is_valid = false;
                $.ajaxSetup({
                    async: false
                });
                $.ajax({
                    url: file + "?act=checkusername",
                    type: "POST",
                    data: "username=" + encodeURI(username),
                    dataType: "json",
                    success: function(res) {
                        if (res.error) {
                            name_is_valid = false;
                            return user.reg.showError("reg_username", res.error);
                        } else {
                            name_is_valid = true;
                        }
                    }
                });
                $.ajaxSetup({
                    async: true
                });
                if (name_is_valid) {
                    return user.reg.showSuccess("reg_username");
                } else {
                    return false;
                }
            },
            //验证密码输入
            password: function(password) {
                if (0 >= password.length) {
                    return user.reg.showError("reg_password", "请输入登录密码");
                }
                if (5 > password.length) {
                    return user.reg.showError("reg_password", "密码长度5-16位，区分大小写");
                }
                return user.reg.showSuccess("reg_password");
            },
            repassword: function() {
                var password = $("#reg_password").val();
                var repassword = $("#reg_repassword").val();
                if (5 > password.length) {
                    user.reg.showError("reg_password", "密码长度5-16位，区分大小写");
                }
                if (password != repassword) {
                    return user.reg.showError("reg_repassword", "两次密码不一致");
                }
                return user.reg.showSuccess("reg_repassword");
            },
            //验证码检查
            verify: function(verify) {
                if (0 == verify.length) {
                    return user.reg.showError("reg_verify", "请填写验证码");
                }
                user.reg.showloading("reg_verify");
                $.postJSON(file + "?act=checkverify", "is_ajax=1&verify=" + verify, function(res) {
                    if ("0" != res.error) {
                        return user.reg.showError("reg_verify", res.error);
                    } else {
                        return user.reg.showSuccess("reg_verify");
                    }
                });
                return user.reg.showSuccess("reg_verify");
            }
        },
        //为注册第一步绑定验证
        bind_check_email: function() {
            $("#reg_email").blur(function() {
                var email = $(this).val();
                if (!user.reg.check.email(email)) {
                    $("#reg_submit").attr("disabled", false).removeClass("ui_btn_big_load ui_btn_big_disabled").addClass("ui_btn_big").val("重试");
                    return false;
                } else {
                    return true;
                }
            });
        }
    };
});

