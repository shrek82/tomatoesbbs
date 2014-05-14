define(function (require, exports, module) {

  var lib = require('lib');
  var upload = {};
  module.exports = upload;

  //引入uploadify插件
  require("./uploadify.js")($);

  //uploader批量上传
  upload.uploaders=(function(){
    var upload_file_ids = '';
    var img_ids = $('#img_ids');
    var img_path = $('#img_path');
    var includBefore = $('#includBefore');
    var uploadify_preview = $('#uploadify_preview');
    var opt={};
    var default_opt= {
      'auto': true,
      'fileTypeExts': '*.gif; *.jpg; *.png',
      'removeCompleted': true,
      'fileSizeLimit': '3MB',
      'width': 160,
      'queueSizeLimit': 20,
      'uploadLimit': 20,
      'method': 'post',
      'multi': true,
      'removeTimeout': 0.5,
      'successTimeout': 30,
      'buttonText': '添加照片...',
      'swf': '/static/uploadify/uploadify.swf',
      'uploader': '/photos/upload',
      'fileObjName': 'photo[img]',
      'formData': {
        "_uploader": "uploadify",
        "_format": "json",
        "<%= key = Rails.application.config.session_options[:key] %>": "<%= cookies[key] %>",
        "<%= request_forgery_protection_token %>": "<%= form_authenticity_token %>"
      },
      //初始化完成
      'onInit': function (instance) {
        console.log('onInit');
      },
      //即将上传
      'onUploadStart': function (file) {
        console.log('onUploadStart');
      },
      //当每一个文件上传成功时触发
      'onUploadSuccess': function (file, data, response) {
        uploadify_preview.css('display', 'block');
        if (data) {
          var json = eval("(" + data + ")");
          if (json.state == "SUCCESS") {
            upload_file_ids = upload_file_ids ? upload_file_ids + ',' + json['file_id'] : json['file_id'];
            img_ids.val(img_ids.val().length > 0 ? img_ids.val() + ',' + json['file_id'] : json['file_id']);
            img_path.val(img_path.val().length == 0 ? json['url'] : img_path.val());
            includBefore.before('<li><img src="' + json['url'] + '"></li>')
          }
          else {
            alert('很抱歉，照片上传失败，原因：\n\n' + json.error);
          }
        }
      },
      //队列完成时触发
      'onQueueComplete': function (queueData) {
        //preview();
      }
    };

    return {
      bindPreview:function(){
        var preview = uploadify_preview.find('li');
        preview.bind('click', function (e) {
          preview.removeClass('cur');
          $('#img_path').val($(this).addClass('cur').find('img').attr('src'));
        });
      },
      bindUpload:function(option){
        opt=$.extend({}, default_opt, option);
        $("#file_upload").uploadify(opt);
        console.log(opt);

      }
    }

  })();

});