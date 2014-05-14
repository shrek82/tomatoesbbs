/*! lib(1.0.0) - JianGang Zhao <zhaojiangang@gmail.com> - 2013-10-23 16:08:43*/
define("lib/1.0.0/popup-debug", [], function(require, exports, module) {
    var popup = function(opt) {
        var opt = opt || {};
        var title = opt.title ? opt.title : "提示";
        this.popup = {};
        this.pup_code = "<div id='ui_pupBox_bg' class='ui_pupBox_bg' ><div class='ui_pupBox'><div class='ui_pupBox_close'></div><div class='ui_pupBox_main'><div class='ui_pupBox_head'> <ul class='ui_pupBox_headtag'> <li id='tab_login' class='current'><span>" + title + "</span></li> </ul> </div> <div class='ui_pupBox_tag_cnt' id='pop_html_box'><p style='color:#999;text-align: center;margin:15px'>正在用绳命加载中...</p></div></div></div></div>";
        this.box = null;
        this.wintop = $(window).scrollTop();
    };
    //初始化弹出窗口
    popup.prototype.start = function(width) {
        var _this = this;
        _this.box = $(_this.pup_code);
        _this.box.appendTo("body");
        width = parseInt(width, 10);
        _this.box.css({
            display: "block",
            height: $(document).height()
        });
        _this.box.find("div.ui_pupBox").css({
            display: "block",
            top: _this.wintop + 80 + "px",
            width: width + 30
        }).animate({
            opacity: 1,
            top: _this.wintop + 160 + "px"
        }, 250);
        //_this.box.find("div.ui_pupBox_tag_cnt").text("");
        _this.box.find("div.ui_pupBox_close").show();
    };
    //关闭窗口
    popup.prototype.close = function() {
        var _this = this;
        _this.box.find("div.ui_pupBox").animate({
            opacity: 0,
            top: _this.wintop + 80 + "px"
        }, 200, function() {
            _this.box.fadeOut(150, function() {
                $(this).remove();
            });
        });
    };
    //ajax载入弹出窗
    popup.prototype.ajax = function(url, width, callback) {
        var _this = this;
        var closebtn = "show";
        _this.start(width);
        $.get(url, function(html) {
            _this.box.find(".ui_pupBox_tag_cnt").html(html);
            if (typeof callback == "function") {
                try {
                    callback();
                } catch (ex) {}
            }
        });
        _this.box.find(".ui_pupBox_close").bind("click", function() {
            _this.close();
        });
        if (closebtn == "hide") {
            _this.box.find(".ui_pupBox_close").hide();
        }
    };
    //显示弹出窗口
    popup.prototype.show = function(obj, width, callback) {
        var _this = this;
        var closebtn = "show";
        var type = typeof obj;
        if ("object" == type) {
            id = obj.id;
            width = obj.width;
            closebtn = obj.closebtn;
        } else {
            id = obj;
        }
        this.start(width);
        var idText = $("#" + id).html();
        _this.box.find(".ui_pupBox_tag_cnt").html(idText);
        _this.box.find(".ui_pupBox_close").bind("click", function() {
            _this.close();
        });
        if (closebtn == "hide") {
            _this.box.find(".ui_pupBox_close").hide();
        }
    };
    //显示html
    popup.prototype.html = function(obj, width, callback) {
        var _this = this;
        var closebtn = "show";
        var type = typeof obj;
        if ("object" == type) {
            html = obj.html;
            width = obj.width;
            closebtn = obj.closebtn;
        } else {
            html = obj;
        }
        _this.start(width);
        _this.box.find(".ui_pupBox_tag_cnt").html(html);
        if (typeof callback == "function") {
            try {
                callback();
            } catch (ex) {}
        }
        _this.box.find(".ui_pupBox_close").bind("click", function() {
            _this.close();
        });
        if (closebtn == "hide") {
            _this.box.find(".ui_pupBox_close").hide();
        }
    };
    module.exports = popup;
});


