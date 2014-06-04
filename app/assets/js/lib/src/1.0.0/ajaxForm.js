define(function (require, exports, module) {

  //ajax提交插件
  require("./jquery_form.js")($);

  //ajaxForm表单提交
  //ajaxForm表单提交
  //jquery.form.js定义的方法检查没有再去定义
  //原生的选项值有，此处不再做填充和检查
  //url,action,method,type,success

  //判断数据类型
  function getType(o) {
    var _t;
    return ((_t = typeof(o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
  }

  //返回一个jquery对象，没有则方法创建并再次返回
  function fetchObj(id, createFun) {
    var obj = $('#' + id);
    if (obj.length) {
      return obj;
    }
    else if (typeof createFun == 'function') {
      createFun();
    }
    obj = $('#' + id);
    if (obj.length) {
      return obj;
    }
    else{
      log('对象' + id + '获取失败');
      return false;
    }
  }

  function ajaxForm(form, opts) {
    var _this = this;

    //jquery表单对象
    this.form = (typeof form == 'string') ? $('#' + form) : form;

    //提交按钮
    this.btn = false;
    //提交状体提示框
    this.flash_msg = false;

    //继承参数
    this.opts = $.extend({}, {
      dataType: 'json',
      timeout: 3000,
      clearForm: false,
      tool: true,
      errorDisplayType: 'formError',
      loading: false,
      redirect: false,
      auto_redirect_to: true,
      auto_redirect_delay: 600,
      callback: false,
      before: false,
      error: false,
      submitButton: 'submit_button',
      successLabel: '提交成功',
      sendingLabel: '发送中',
      errorLabel: '重试'
    }, opts);

    //ajaxSubmit提交前执行
    this.opts.before = function () {

      //提交前先执行用户定义的方法
      if (typeof opts.before == 'function') {
        opts.before();
      }

      //提交状态提示框
      if (!_this.form.length) {
        alert('很抱歉，未找到表单对象!');
        return false;
      }

      //获取提交按钮
      _this.btn=_this.form.find(':submit');
      if(!_this.btn.length){
        _this.btn = $('#' + _this.opts.submitButton);
      }
      if (!_this.btn.length) {
        alert('未找到提交按钮');
        return false;
      }

      //flash提示框
      _this.flash_msg = fetchObj('flash_msg', function () {
        _this.form.after('<div id="flash_msg"></div>');
      })

      _this._format = fetchObj('_format', function () {
        _this.form.after('<input type="hidden" id="_format" name="_format" value="' + _this.opts.dataType + '">');
      })

      //让提交按钮暂时不可用，并显示发送状态
      if (_this.btn.get(0).tagName == 'INPUT') {
        _this.btn.attr('disabled', true).attr('value', _this.opts.sendingLabel);
      }
      else if (_this.btn.get(0).tagName == 'BUTTON') {
        _this.btn.attr('disabled', true).html('<i class="icon-refresh icon-spin"></i>&nbsp;' + _this.opts.sendingLabel);
      }
    };

    //请求成功
    this.opts.success = function (data) {
      var is_error = false;
      var html_errors = null;

      //判断请求结果是否包含警告或错误(用户错误)
      if (_this.opts.dataType == 'json' && data.error) {
        is_error = true;
        //错误信息
        var errors_message = new Array();
        //出错的表单元素
        var error_element_ids = new Array();

        var error_type = getType(data.error);
        if (error_type === 'string') {
          errors_message.push(data.error);
        }
        else if (error_type === 'array') {
          errors_message = data.error;
        }
        else if (error_type === 'object') {
          for (k in data.error) {
            error_element_ids.push(k);
            if (getType(data.error[k]) === 'array') {
              for (x in data.error[k]) {
                errors_message.push(data.error[k][x]);
              }
            }
            else {
              errors_message.push(data.error[k]);
            }
          }
        }

        html_errors = '<ul>';
        for (e in errors_message) {
          html_errors += '<li>' + errors_message[e] + '</li>';
        }
        html_errors += '</ul>';
      }

      //返回正确内容-----------------------------------------------------
      if (!is_error) {
        //重置按钮
        if (_this.btn.get(0).tagName == 'INPUT') {
          _this.btn.attr('value', _this.opts.successLabel);
        }
        else if (_this.btn.get(0).tagName == 'BUTTON') {
          _this.btn.html('<i class="icon-ok"></i>&nbsp;' + _this.opts.successLabel);
        }
        //移除消息框
        _this.flash_msg.remove();
        //成功后调整到某一个页面
        if (_this.opts.redirect) {
          window.location.href = _this.opts.redirect;
          return false;
        }
        //用户自定义成功后方法
        if (typeof _this.opts.callback == 'function') {
          _this.opts.callback(data);
        }

        //json返回包含跳转地址，可自动调整
        if (_this.opts.dataType == 'json' && _this.opts.auto_redirect_to && data.redirect_to) {

          if (_this.btn.get(0).tagName == 'INPUT') {
            _this.btn.attr('disabled', true);
            _this.btn.attr('value', _this.opts.successLabel);
          }
          else if (_this.btn.get(0).tagName == 'BUTTON') {
            _this.btn.attr('disabled', true);
            _this.btn.html(_this.opts.successLabel);
          }
          setTimeout(function () {
            window.location.href = data.redirect_to;
          }, _this.opts.auto_redirect_delay);

          return false;
        }
      }
      //返回错误信息---------------------------------
      else {
        if (_this.btn.get(0).tagName == 'INPUT') {
          _this.btn.attr('disabled', false);
          _this.btn.attr('value', _this.opts.errorLabel);
        }
        else if (_this.btn.get(0).tagName == 'BUTTON') {
          _this.btn.attr('disabled', false);
          _this.btn.html(_this.opts.errorLabel);
        }

        //原色闪烁提示
        for (k in error_element_ids) {
          // _this.form.find('#form_' + error_element_ids[k]).addClass('ui_input_error');
        }

        //在表单底部提示错误
        if (_this.opts.errorDisplayType == 'formError') {
          _this.flash_msg.addClass('alert alert-block');
          _this.flash_msg.html(html_errors).fadeIn();
          setTimeout(function () {

            _this.flash_msg.fadeOut(function () {
              for (k in error_element_ids) {
                //_this.form.find('#form_' + error_element_ids[k]).removeClass('ui_input_error');
              }
            });

          }, 4000);
        }
        //系统弹出窗口
        else if (_this.opts.errorDisplayType == 'alert') {
          _this.flash_msg.html('');
          alert(html_errors);
        }
        //facebox弹出窗
        else if (_this.opts.errorDisplayType == 'dialogbox') {
          _this.flash_msg.html('');
          alert(html_errors);
        }
        else {
          alert(html_errors);
        }

      }

      //重新激活重试提交
      _this.btn.attr('disabled', false);

    };

    //请求错误信息
    this.opts.error = function (xhr) {

      if (_this.btn.get(0).tagName == 'INPUT') {
        _this.btn.attr('disabled', false);
        _this.btn.attr('value', _this.opts.errorLabel);
      }
      else if (_this.btn.get(0).tagName == 'BUTTON') {
        _this.btn.attr('disabled', false);
        _this.btn.html(_this.opts.errorLabel);
      }

      _this.flash_msg.addClass('alert alert-error');

      if (xhr.readyState == 4 && xhr.status == 0) {
        _this.flash_msg.html('很抱歉，请求超时，请重试或与管理员联系!');
      }
      if (xhr.readyState == 4 && xhr.status == 200) {
        _this.flash_msg.html('程序出错，请重试或与管理员联系!');
      }
      else {
        _this.flash_msg.html('很抱歉，数据发送失败，可能是程序有问题，请重试或与管理员联系！');
      }
      _this.flash_msg.fadeIn(400);
      setTimeout(function () {
        _this.flash_msg.fadeOut(400);
      }, 10000);
    };

  };

  //ajax提交表单
  ajaxForm.prototype.send = function () {
    this.opts.before();
    this.form.ajaxSubmit(this.opts);
    return false;
  };

  module.exports=ajaxForm;

})