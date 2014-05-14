define(function (require, exports, module) {
  
  var lib=require('lib');

  //用户登录注册等方法
  var user = {};
  module.exports = user;

  //绑定登录
  user.bindLoginForm = function () {
    $('#login_form').bind("submit", function (e) {
      e.preventDefault();
      new lib.ajaxForm('login_form', {
        dataType: 'json',
        successLabel: '登录成功',
        sendingLabel: '验证中..',
        errorLabel: '重试登录',
        callback: function () {
          window.location.href = $('#previous_url').val();
        }
      }).send();
    });
  }


});