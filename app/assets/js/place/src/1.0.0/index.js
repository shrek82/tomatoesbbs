define(function (require, exports, module) {

  //基本库
  require('lib');

  return function () {

    //目的地导航
    $(".gui_nav_item").hover(function () {
      $(this).addClass("gui_nav_item_current");
    }, function () {
      $(this).removeClass("gui_nav_item_current");
    });

    $(document).click(function () {
      if ($("#jn_search_drop").is(":visible")) {
        $("#jn_search_drop").hide();
      }
    });

    $("#jn_search_drop").click(function (event) {
      event.stopPropagation();
    });

    $("#jn_search_input").click(function (event) {
      if ($(this).val() != $(this).attr("placeholder") && $(this).val() != "") {
        $("#jn_search_drop").show();
      }
      event.stopPropagation();
    });
  };


});