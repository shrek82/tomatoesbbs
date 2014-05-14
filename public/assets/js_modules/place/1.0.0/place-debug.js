/*! place(1.0.0) - JianGang Zhao <zhaojiangang@gmail.com> - 2013-10-14 16:47:11*/
define("place/1.0.0/place-debug", [ "./index-debug", "lib/latest/lib-debug" ], function(require, exports, module) {
    var place = {};
    //首页功能
    place.index = require("./index-debug");
    module.exports = place;
});

define("place/1.0.0/index-debug", [ "lib/latest/lib-debug" ], function(require, exports, module) {
    //基本库
    require("lib/latest/lib-debug");
    return function() {
        //目的地导航
        $(".gui_nav_item").hover(function() {
            $(this).addClass("gui_nav_item_current");
        }, function() {
            $(this).removeClass("gui_nav_item_current");
        });
        $(document).click(function() {
            if ($("#jn_search_drop").is(":visible")) {
                $("#jn_search_drop").hide();
            }
        });
        $("#jn_search_drop").click(function(event) {
            event.stopPropagation();
        });
        $("#jn_search_input").click(function(event) {
            if ($(this).val() != $(this).attr("placeholder") && $(this).val() != "") {
                $("#jn_search_drop").show();
            }
            event.stopPropagation();
        });
    };
});


