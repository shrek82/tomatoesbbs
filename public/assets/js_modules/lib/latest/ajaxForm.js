/*! lib(1.0.0) - JianGang Zhao <zhaojiangang@gmail.com> - 2013-10-23 16:08:48*/
define("lib/latest/ajaxForm",["./jquery_form.js"],function(t,n,r){function i(e){var t;return("object"==(t=typeof e)?null==e&&"null"||Object.prototype.toString.call(e).slice(8,-1):t).toLowerCase()}function a(e,t){var n=$("#"+e);return n.length?n:("function"==typeof t&&t(),n=$("#"+e),n.length?n:(log("\u5bf9\u8c61"+e+"\u83b7\u53d6\u5931\u8d25"),!1))}function o(t,n){var r=this;this.form="string"==typeof t?$("#"+t):t,this.btn=!1,this.flash_msg=!1,this.opts=$.extend({},{dataType:"json",timeout:3e3,clearForm:!1,tool:!0,errorDisplayType:"formError",loading:!1,redirect:!1,auto_redirect_to:!0,auto_redirect_delay:600,callback:!1,before:!1,error:!1,submitButton:"submit_button",successLabel:"\u63d0\u4ea4\u6210\u529f",sendingLabel:"\u53d1\u9001\u4e2d",errorLabel:"\u91cd\u8bd5"},n),this.opts.before=function(){return"function"==typeof n.before&&n.before(),r.form.length?(r.btn=$("#"+r.opts.submitButton),r.btn.length?(r.flash_msg=a("flash_msg",function(){r.form.after('<div id="flash_msg"></div>')}),r._format=a("_format",function(){r.form.after('<input type="hidden" id="_format" name="_format" value="'+r.opts.dataType+'">')}),"INPUT"==r.btn.get(0).tagName?r.btn.attr("disabled",!0).attr("value",r.opts.sendingLabel):"BUTTON"==r.btn.get(0).tagName&&r.btn.attr("disabled",!0).html('<i class="icon-refresh icon-spin"></i>&nbsp;'+r.opts.sendingLabel),void 0):(alert("\u672a\u627e\u5230\u63d0\u4ea4\u6309\u94ae"),!1)):(alert("\u5f88\u62b1\u6b49\uff0c\u672a\u627e\u5230\u8868\u5355\u5bf9\u8c61!"),!1)},this.opts.success=function(t){var n=!1,a=null;if("json"==r.opts.dataType&&t.error){n=!0;var o=[],s=[],l=i(t.error);if("string"===l)o.push(t.error);else if("array"===l)o=t.error;else if("object"===l)for(k in t.error)if(s.push(k),"array"===i(t.error[k]))for(x in t.error[k])o.push(t.error[k][x]);else o.push(t.error[k]);a="<ul>";for(e in o)a+="<li>"+o[e]+"</li>";a+="</ul>"}if(n){"INPUT"==r.btn.get(0).tagName?(r.btn.attr("disabled",!1),r.btn.attr("value",r.opts.errorLabel)):"BUTTON"==r.btn.get(0).tagName&&(r.btn.attr("disabled",!1),r.btn.html(r.opts.errorLabel));for(k in s);"formError"==r.opts.errorDisplayType?(r.flash_msg.addClass("alert alert-block"),r.flash_msg.html(a).fadeIn(),setTimeout(function(){r.flash_msg.fadeOut(function(){for(k in s);})},4e3)):"alert"==r.opts.errorDisplayType?(r.flash_msg.html(""),alert(a)):"dialogbox"==r.opts.errorDisplayType?(r.flash_msg.html(""),alert(a)):alert(a)}else{if("INPUT"==r.btn.get(0).tagName?r.btn.attr("value",r.opts.successLabel):"BUTTON"==r.btn.get(0).tagName&&r.btn.html('<i class="icon-ok"></i>&nbsp;'+r.opts.successLabel),r.flash_msg.remove(),r.opts.redirect)return window.location.href=r.opts.redirect,!1;if("function"==typeof r.opts.callback&&r.opts.callback(t),"json"==r.opts.dataType&&r.opts.auto_redirect_to&&t.redirect_to)return"INPUT"==r.btn.get(0).tagName?(r.btn.attr("disabled",!0),r.btn.attr("value",r.opts.successLabel)):"BUTTON"==r.btn.get(0).tagName&&(r.btn.attr("disabled",!0),r.btn.html(r.opts.successLabel)),setTimeout(function(){window.location.href=t.redirect_to},r.opts.auto_redirect_delay),!1}r.btn.attr("disabled",!1)},this.opts.error=function(e){"INPUT"==r.btn.get(0).tagName?(r.btn.attr("disabled",!1),r.btn.attr("value",r.opts.errorLabel)):"BUTTON"==r.btn.get(0).tagName&&(r.btn.attr("disabled",!1),r.btn.html(r.opts.errorLabel)),r.flash_msg.addClass("alert alert-error"),4==e.readyState&&0==e.status&&r.flash_msg.html("\u5f88\u62b1\u6b49\uff0c\u8bf7\u6c42\u8d85\u65f6\uff0c\u8bf7\u91cd\u8bd5\u6216\u4e0e\u7ba1\u7406\u5458\u8054\u7cfb!"),4==e.readyState&&200==e.status?r.flash_msg.html("\u7a0b\u5e8f\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5\u6216\u4e0e\u7ba1\u7406\u5458\u8054\u7cfb!"):r.flash_msg.html("\u5f88\u62b1\u6b49\uff0c\u6570\u636e\u53d1\u9001\u5931\u8d25\uff0c\u53ef\u80fd\u662f\u7a0b\u5e8f\u6709\u95ee\u9898\uff0c\u8bf7\u91cd\u8bd5\u6216\u4e0e\u7ba1\u7406\u5458\u8054\u7cfb\uff01"),r.flash_msg.fadeIn(400),setTimeout(function(){r.flash_msg.fadeOut(400)},1e4)}}t("./jquery_form")($),o.prototype.send=function(){return this.opts.before(),this.form.ajaxSubmit(this.opts),!1},r.exports=o}),define("lib/latest/jquery_form",[],function(){return function(){(function(e){"use strict";function t(t){var n=t.data;t.isDefaultPrevented()||(t.preventDefault(),e(this).ajaxSubmit(n))}function n(t){var n=t.target,r=e(n);if(!r.is(":submit,input:image")){var i=r.closest(":submit");if(0===i.length)return;n=i[0]}var a=this;if(a.clk=n,"image"==n.type)if(void 0!==t.offsetX)a.clk_x=t.offsetX,a.clk_y=t.offsetY;else if("function"==typeof e.fn.offset){var o=r.offset();a.clk_x=t.pageX-o.left,a.clk_y=t.pageY-o.top}else a.clk_x=t.pageX-n.offsetLeft,a.clk_y=t.pageY-n.offsetTop;setTimeout(function(){a.clk=a.clk_x=a.clk_y=null},100)}function r(){if(e.fn.ajaxSubmit.debug){var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}}var i={};i.fileapi=void 0!==e("<input type='file'/>").get(0).files,i.formdata=void 0!==window.FormData,e.fn.ajaxSubmit=function(t){function n(n){for(var r=new FormData,i=0;n.length>i;i++)r.append(n[i].name,n[i].value);if(t.extraData)for(var a in t.extraData)t.extraData.hasOwnProperty(a)&&r.append(a,t.extraData[a]);t.data=null;var o=e.extend(!0,{},e.ajaxSettings,t,{contentType:!1,processData:!1,cache:!1,type:"POST"});t.uploadProgress&&(o.xhr=function(){var e=jQuery.ajaxSettings.xhr();return e.upload&&(e.upload.onprogress=function(e){var n=0,r=e.loaded||e.position,i=e.total;e.lengthComputable&&(n=Math.ceil(100*(r/i))),t.uploadProgress(e,r,i,n)}),e}),o.data=null;var s=o.beforeSend;o.beforeSend=function(e,t){t.data=r,s&&s.call(this,e,t)},e.ajax(o)}function a(n){function i(e){var t=e.contentWindow?e.contentWindow.document:e.contentDocument?e.contentDocument:e.document;return t}function a(){function t(){try{var e=i(g).readyState;r("state = "+e),e&&"uninitialized"==e.toLowerCase()&&setTimeout(t,50)}catch(n){r("Server abort: ",n," (",n.name,")"),s(S),T&&clearTimeout(T),T=void 0}}var n=u.attr("target"),a=u.attr("action");w.setAttribute("target",h),o||w.setAttribute("method","POST"),a!=f.url&&w.setAttribute("action",f.url),f.skipEncodingOverride||o&&!/post/i.test(o)||u.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),f.timeout&&(T=setTimeout(function(){x=!0,s(N)},f.timeout));var l=[];try{if(f.extraData)for(var c in f.extraData)f.extraData.hasOwnProperty(c)&&l.push(e('<input type="hidden" name="'+c+'">').attr("value",f.extraData[c]).appendTo(w)[0]);f.iframeTarget||(m.appendTo("body"),g.attachEvent?g.attachEvent("onload",s):g.addEventListener("load",s,!1)),setTimeout(t,15),w.submit()}finally{w.setAttribute("action",a),n?w.setAttribute("target",n):u.removeAttr("target"),e(l).remove()}}function s(t){if(!v.aborted&&!D){try{_=i(g)}catch(n){r("cannot access response document: ",n),t=S}if(t===N&&v)return v.abort("timeout"),void 0;if(t==S&&v)return v.abort("server abort"),void 0;if(_&&_.location.href!=f.iframeSrc||x){g.detachEvent?g.detachEvent("onload",s):g.removeEventListener("load",s,!1);var a,o="success";try{if(x)throw"timeout";var l="xml"==f.dataType||_.XMLDocument||e.isXMLDoc(_);if(r("isXml="+l),!l&&window.opera&&(null===_.body||!_.body.innerHTML)&&--A)return r("requeing onLoad callback, DOM not available"),setTimeout(s,250),void 0;var u=_.body?_.body:_.documentElement;v.responseText=u?u.innerHTML:null,v.responseXML=_.XMLDocument?_.XMLDocument:_,l&&(f.dataType="xml"),v.getResponseHeader=function(e){var t={"content-type":f.dataType};return t[e]},u&&(v.status=Number(u.getAttribute("status"))||v.status,v.statusText=u.getAttribute("statusText")||v.statusText);var c=(f.dataType||"").toLowerCase(),d=/(json|script|text)/.test(c);if(d||f.textarea){var h=_.getElementsByTagName("textarea")[0];if(h)v.responseText=h.value,v.status=Number(h.getAttribute("status"))||v.status,v.statusText=h.getAttribute("statusText")||v.statusText;else if(d){var y=_.getElementsByTagName("pre")[0],b=_.getElementsByTagName("body")[0];y?v.responseText=y.textContent?y.textContent:y.innerText:b&&(v.responseText=b.textContent?b.textContent:b.innerText)}}else"xml"==c&&!v.responseXML&&v.responseText&&(v.responseXML=L(v.responseText));try{C=M(v,c,f)}catch(t){o="parsererror",v.error=a=t||o}}catch(t){r("error caught: ",t),o="error",v.error=a=t||o}v.aborted&&(r("upload aborted"),o=null),v.status&&(o=v.status>=200&&300>v.status||304===v.status?"success":"error"),"success"===o?(f.success&&f.success.call(f.context,C,"success",v),p&&e.event.trigger("ajaxSuccess",[v,f])):o&&(void 0===a&&(a=v.statusText),f.error&&f.error.call(f.context,v,o,a),p&&e.event.trigger("ajaxError",[v,f,a])),p&&e.event.trigger("ajaxComplete",[v,f]),p&&!--e.active&&e.event.trigger("ajaxStop"),f.complete&&f.complete.call(f.context,v,o),D=!0,f.timeout&&clearTimeout(T),setTimeout(function(){f.iframeTarget||m.remove(),v.responseXML=null},100)}}}var l,c,f,p,h,m,g,v,y,b,x,T,w=u[0],k=!!e.fn.prop;if(e(":input[name=submit],:input[id=submit]",w).length)return alert('Error: Form elements must not have name or id of "submit".'),void 0;if(n)for(c=0;d.length>c;c++)l=e(d[c]),k?l.prop("disabled",!1):l.removeAttr("disabled");if(f=e.extend(!0,{},e.ajaxSettings,t),f.context=f.context||f,h="jqFormIO"+(new Date).getTime(),f.iframeTarget?(m=e(f.iframeTarget),b=m.attr("name"),b?h=b:m.attr("name",h)):(m=e('<iframe name="'+h+'" src="'+f.iframeSrc+'" />'),m.css({position:"absolute",top:"-1000px",left:"-1000px"})),g=m[0],v={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(t){var n="timeout"===t?"timeout":"aborted";r("aborting upload... "+n),this.aborted=1,m.attr("src",f.iframeSrc),v.error=n,f.error&&f.error.call(f.context,v,n,t),p&&e.event.trigger("ajaxError",[v,f,n]),f.complete&&f.complete.call(f.context,v,n)}},p=f.global,p&&0===e.active++&&e.event.trigger("ajaxStart"),p&&e.event.trigger("ajaxSend",[v,f]),f.beforeSend&&f.beforeSend.call(f.context,v,f)===!1)return f.global&&e.active--,void 0;if(!v.aborted){y=w.clk,y&&(b=y.name,b&&!y.disabled&&(f.extraData=f.extraData||{},f.extraData[b]=y.value,"image"==y.type&&(f.extraData[b+".x"]=w.clk_x,f.extraData[b+".y"]=w.clk_y)));var N=1,S=2,j=e("meta[name=csrf-token]").attr("content"),E=e("meta[name=csrf-param]").attr("content");E&&j&&(f.extraData=f.extraData||{},f.extraData[E]=j),f.forceSync?a():setTimeout(a,10);var C,_,D,A=50,L=e.parseXML||function(e,t){return window.ActiveXObject?(t=new ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&"parsererror"!=t.documentElement.nodeName?t:null},F=e.parseJSON||function(e){return window.eval("("+e+")")},M=function(t,n,r){var i=t.getResponseHeader("content-type")||"",a="xml"===n||!n&&i.indexOf("xml")>=0,o=a?t.responseXML:t.responseText;return a&&"parsererror"===o.documentElement.nodeName&&e.error&&e.error("parsererror"),r&&r.dataFilter&&(o=r.dataFilter(o,n)),"string"==typeof o&&("json"===n||!n&&i.indexOf("json")>=0?o=F(o):("script"===n||!n&&i.indexOf("javascript")>=0)&&e.globalEval(o)),o}}}if(!this.length)return r("ajaxSubmit: skipping submit process - no element selected"),this;var o,s,l,u=this;"function"==typeof t&&(t={success:t}),o=this.attr("method"),s=this.attr("action"),l="string"==typeof s?e.trim(s):"",l=l||window.location.href||"",l&&(l=(l.match(/^([^#]+)/)||[])[1]),t=e.extend(!0,{url:l,success:e.ajaxSettings.success,type:o||"GET",iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},t);var c={};if(this.trigger("form-pre-serialize",[this,t,c]),c.veto)return r("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(t.beforeSerialize&&t.beforeSerialize(this,t)===!1)return r("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var f=t.traditional;void 0===f&&(f=e.ajaxSettings.traditional);var p,d=[],h=this.formToArray(t.semantic,d);if(t.data&&(t.extraData=t.data,p=e.param(t.data,f)),t.beforeSubmit&&t.beforeSubmit(h,this,t)===!1)return r("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[h,this,t,c]),c.veto)return r("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var m=e.param(h,f);p&&(m=m?m+"&"+p:p),"GET"==t.type.toUpperCase()?(t.url+=(t.url.indexOf("?")>=0?"&":"?")+m,t.data=null):t.data=m;var g=[];if(t.resetForm&&g.push(function(){u.resetForm()}),t.clearForm&&g.push(function(){u.clearForm(t.includeHidden)}),!t.dataType&&t.target){var v=t.success||function(){};g.push(function(n){var r=t.replaceTarget?"replaceWith":"html";e(t.target)[r](n).each(v,arguments)})}else t.success&&g.push(t.success);t.success=function(e,n,r){for(var i=t.context||t,a=0,o=g.length;o>a;a++)g[a].apply(i,[e,n,r||u,u])};var y=e("input:file:enabled[value]",this),b=y.length>0,x="multipart/form-data",T=u.attr("enctype")==x||u.attr("encoding")==x,w=i.fileapi&&i.formdata;r("fileAPI :"+w);var k=(b||T)&&!w;t.iframe!==!1&&(t.iframe||k)?t.closeKeepAlive?e.get(t.closeKeepAlive,function(){a(h)}):a(h):(b||T)&&w?n(h):e.ajax(t);for(var N=0;d.length>N;N++)d[N]=null;return this.trigger("form-submit-notify",[this,t]),this},e.fn.ajaxForm=function(i){if(i=i||{},i.delegation=i.delegation&&e.isFunction(e.fn.on),!i.delegation&&0===this.length){var a={s:this.selector,c:this.context};return!e.isReady&&a.s?(r("DOM not ready, queuing ajaxForm"),e(function(){e(a.s,a.c).ajaxForm(i)}),this):(r("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return i.delegation?(e(document).off("submit.form-plugin",this.selector,t).off("click.form-plugin",this.selector,n).on("submit.form-plugin",this.selector,i,t).on("click.form-plugin",this.selector,i,n),this):this.ajaxFormUnbind().bind("submit.form-plugin",i,t).bind("click.form-plugin",i,n)},e.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(t,n){var r=[];if(0===this.length)return r;var a=this[0],o=t?a.getElementsByTagName("*"):a.elements;if(!o)return r;var s,l,u,c,f,p,d;for(s=0,p=o.length;p>s;s++)if(f=o[s],u=f.name)if(t&&a.clk&&"image"==f.type)f.disabled||a.clk!=f||(r.push({name:u,value:e(f).val(),type:f.type}),r.push({name:u+".x",value:a.clk_x},{name:u+".y",value:a.clk_y}));else if(c=e.fieldValue(f,!0),c&&c.constructor==Array)for(n&&n.push(f),l=0,d=c.length;d>l;l++)r.push({name:u,value:c[l]});else if(i.fileapi&&"file"==f.type&&!f.disabled){n&&n.push(f);var h=f.files;if(h.length)for(l=0;h.length>l;l++)r.push({name:u,value:h[l],type:f.type});else r.push({name:u,value:"",type:f.type})}else null!==c&&c!==void 0&&(n&&n.push(f),r.push({name:u,value:c,type:f.type,required:f.required}));if(!t&&a.clk){var m=e(a.clk),g=m[0];u=g.name,u&&!g.disabled&&"image"==g.type&&(r.push({name:u,value:m.val()}),r.push({name:u+".x",value:a.clk_x},{name:u+".y",value:a.clk_y}))}return r},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var n=[];return this.each(function(){var r=this.name;if(r){var i=e.fieldValue(this,t);if(i&&i.constructor==Array)for(var a=0,o=i.length;o>a;a++)n.push({name:r,value:i[a]});else null!==i&&i!==void 0&&n.push({name:this.name,value:i})}}),e.param(n)},e.fn.fieldValue=function(t){for(var n=[],r=0,i=this.length;i>r;r++){var a=this[r],o=e.fieldValue(a,t);null===o||void 0===o||o.constructor==Array&&!o.length||(o.constructor==Array?e.merge(n,o):n.push(o))}return n},e.fieldValue=function(t,n){var r=t.name,i=t.type,a=t.tagName.toLowerCase();if(void 0===n&&(n=!0),n&&(!r||t.disabled||"reset"==i||"button"==i||("checkbox"==i||"radio"==i)&&!t.checked||("submit"==i||"image"==i)&&t.form&&t.form.clk!=t||"select"==a&&-1==t.selectedIndex))return null;if("select"==a){var o=t.selectedIndex;if(0>o)return null;for(var s=[],l=t.options,u="select-one"==i,c=u?o+1:l.length,f=u?o:0;c>f;f++){var p=l[f];if(p.selected){var d=p.value;if(d||(d=p.attributes&&p.attributes.value&&!p.attributes.value.specified?p.text:p.value),u)return d;s.push(d)}}return s}return e(t).val()},e.fn.clearForm=function(t){return this.each(function(){e("input,select,textarea",this).clearFields(t)})},e.fn.clearFields=e.fn.clearInputs=function(t){var n=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var r=this.type,i=this.tagName.toLowerCase();n.test(r)||"textarea"==i?this.value="":"checkbox"==r||"radio"==r?this.checked=!1:"select"==i?this.selectedIndex=-1:t&&(t===!0&&/hidden/.test(r)||"string"==typeof t&&e(this).is(t))&&(this.value="")})},e.fn.resetForm=function(){return this.each(function(){("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset()})},e.fn.enable=function(e){return void 0===e&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return void 0===t&&(t=!0),this.each(function(){var n=this.type;if("checkbox"==n||"radio"==n)this.checked=t;else if("option"==this.tagName.toLowerCase()){var r=e(this).parent("select");t&&r[0]&&"select-one"==r[0].type&&r.find("option").selected(!1),this.selected=t}})},e.fn.ajaxSubmit.debug=!1})(jQuery)}});