/*! global(1.1.0) - JianGang Zhao <zhaojiangang@gmail.com> - 2014-05-14 16:38:55*/
define("global/latest/ueditor_config-debug", [], function(require, exports, module) {
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


