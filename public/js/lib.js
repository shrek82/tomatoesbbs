var SF = {params: false};
(function (h) {
  SF.slug = function (q, o) {
    var m = new RegExp("[\\w\\u3300-\\u33ff\\u3400-\\u4d8f\\u4e00-\\u9fff\\+\\-\\.#]+", "g"), n = q.match(m);
    if (null == n) {
      return""
    }
    return n.join(o)
  };
  SF.param = function (x) {
    if (false === SF.params) {
      if (!!window.location.search) {
        var v = decodeURI(window.location.search.substring(1));
        var o = v.split("&");
        var t = {}, m, w, s;
        for (var u = 0, r = o.length; u < r; u++) {
          m = o[u].split("=");
          w = m[0];
          if (w.indexOf("[]") == (w.length - 2)) {
            var q = w.substring(0, w.length - 2);
            if (t[q] === undefined) {
              t[q] = []
            }
            t[q].push(m[1])
          }
          else{
            t[w] = m[1]
          }
        }
        SF.params = t
      }
      else{
        SF.params = {}
      }
    }
    return SF.params[x]
  };
  SF.commonError = function (q) {
    if (q.status) {
      var n, m, p;
      switch (q.status) {
        case 1:
          n = "您必须登录后才能继续进行此操作";
          m = "转到登录页";
          p = "需要登录";
          break;
        case 2:
          n = "此操作在登录状态下无法完成";
          p = "需要未登录";
          break;
        case 3:
          if ("access" == q.data[0]) {
            n = "此操作要求您的声望值至少达到 <strong>" + q.data[2] + '</strong>，<a href="http://segmentfault.com/q/1010000000191720" target="_blank">如何获得声望？</a>';
            p = "声望值不够"
          }
          else{
            if ("group" == q.data[0]) {
              n = "您不在授权的用户组中";
              p = "不在用户组中"
            }
            else{
              if ("site" == q.data[0]) {
                n = "您不在授权的用户组中";
                p = "不在用户组中"
              }
              else{
                if ("blackhole" == q.data[0]) {
                  n = "您的操作次数过多或者频率过快";
                  p = "操作受到限制"
                }
                else{
                  if ("allow" == q.data[0]) {
                    n = "您没有进行此操作的权限";
                    p = "权限不足"
                  }
                  else{
                    if ("self" == q.data[0]) {
                      if (q.data[1]) {
                        n = "您不是作者, 无法进行此操作";
                        p = "仅限作者本人"
                      }
                      else{
                        n = "您是作者, 无法对自己进行此操作";
                        p = "限制作者本人"
                      }
                    }
                    else{
                      if ("block" == q.data[0]) {
                        if (q.data[1]) {
                          n = "您的账号没有被锁定";
                          p = "仅限锁定账号"
                        }
                        else{
                          n = "您的账号已经被锁定, 无法进行此操作";
                          p = "限制锁定账号"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          break;
        default:
          return
      }
      h("<p>" + n + "</p>").modal({title: p, action: m, onAction: function () {
        window.location.href = h("#login-link").attr("href")
      }})
    }
  };
  function i(n) {
    var m = n.url, p = m.lastIndexOf("?"), o = p > 0 ? m.substring(p + 1, m.length) : "";
    m = m.substring(m.lastIndexOf("/") + 1, p > 0 ? p : m.length) + "?" + (n.data ? n.data + "&" : "") + o;
    return m
  }

  function e(m) {
    var o = {tag: ["show"], comment: ["show"]}, p = m.split("?"), s = p[0], t = p[1].split("&");
    for (var u in o) {
      var n = o[u];
      if (s != u) {
        continue
      }
      if (!n) {
        return false
      }
      else{
        for (var q = 0; q < n.length; q++) {
          var r = "do=" + n[q];
          if (h.inArray(r, t) >= 0) {
            return false
          }
        }
      }
    }
    return true
  }

  var b = [], f = h('<div class="s-loading">加载中</div>');
  var j = h.cookie("sfsess");
  if (j) {
    h.ajaxSetup({data: {sfsess: encodeURIComponent(j)}})
  }
  h(document).ajaxSend(function (o, p, n) {
    var m = i(n);
    if ("json" == n.dataType) {
      if (e(m)) {
        f.show()
      }
    }
    else{
      return
    }
    if (h.inArray(m, b) >= 0) {
      p.abort();
      return false
    }
    b.push(m)
  });
  h(document).ajaxComplete(function (q, s, p) {
    var n = i(p);
    if ("json" == p.dataType) {
      if (e(n)) {
        f.hide()
      }
    }
    else{
      return
    }
    var m = h.inArray(n, b);
    if (m >= 0) {
      b.splice(m, 1)
    }
    if (4 == s.readyState && 200 == s.status) {
      var r = h.parseJSON(s.responseText);
      SF.commonError(r)
    }
    else{
      if (s.status >= 500) {
        h("<p>网络出现故障, 请稍后重试</p>").modal({title: "网络故障"})
      }
    }
  });
  h(document).ready(function () {
    f.hide().appendTo(document.body)
  });
  h.fn.login = function () {
    window.login = h(this).length > 0 ? h(this).data("user") : null
  };
  h.fn.error = function (m) {
    this.each(function () {
      var n = h(this);
      if (!n.data("errorBinded")) {
        n.keyup(function () {
          h(".text-error", h(this).removeClass("input-error").parent()).remove()
        });
        n.data("errorBinded", 1)
      }
      h(".text-error", n.parent()).remove();
      h('<span class="text-error">' + m + "</span>").insertAfter(n.addClass("input-error"))
    })
  };
  h.fn.autoResize = function () {
    return this.each(function () {
      var m = this;
      m.originalBlurHeight = h(m).height();
      m.focused = false;
      h(m).focus(function () {
        this.focused = true;
        if (!this.originalFocusHeight) {
          this.originalFocusHeight = h(this).height()
        }
        else{
          if (this.justifyDoc && this.justifyDoc.value.length == 0) {
            h(this).height(this.originalFocusHeight)
          }
        }
        if (!this.justifyDoc) {
          this.justifyDoc = h(document.createElement("div"));
          this.justifyDoc.value = "";
          this.justifyDoc.css(h(this).css()).css({display: "none", "word-wrap": "break-word", "min-height": h(this).height(), height: "auto"}).insertAfter(h(this).css("overflow-y", "hidden"))
        }
      });
      h(m).blur(function () {
        this.focused = false;
        if (this.originalBlurHeight && 0 == this.justifyDoc.value.length) {
          h(this).height(this.originalBlurHeight)
        }
      });
      h(m).bind("clear", function () {
        h(this).val("");
        this.focused = false;
        if (this.justifyDoc) {
          this.justifyDoc.value = "";
          h(this.justifyDoc).html("")
        }
        h(this).trigger("blur")
      });
      setInterval(function () {
        var o = h(m);
        if (!m.focused || !m.justifyDoc || o.val() == m.justifyDoc.value) {
          return
        }
        m.justifyDoc.value = o.val();
        var n = m.justifyDoc.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;").replace(/ /g, "&nbsp;").replace(/((&nbsp;)*)&nbsp;/g, "$1 ").replace(/\n/g, "<br />").replace(/<br \/>[ ]*$/, "<br />-").replace(/<br \/> /g, "<br />&nbsp;");
        m.justifyDoc.html(n.length > 0 ? n : "&nbsp;");
        o.height(m.justifyDoc.height())
      }, 10);
      h(m).trigger("focus")
    })
  };
  h.fn.eventPopup = function (E) {
    var r = {url: "", suffix: "", balloonClass: "", messageBoxId: "msg-box", interval: 30000}, q = h.extend(r, E);
    if (0 == this.length) {
      return
    }
    var B = this, D = h('<span class="' + q.balloonClass + '"></span>').appendTo(B), s = h('<ul id="' + q.messageBoxId + '" class="dropdown-msg"></ul>').insertAfter(B), o = B.attr("href"), n = B.parent();
    var m, v, u = -1, x = null, C = false, y = document.title;

    function w(p) {
      if (p > 0) {
        D.html(p).addClass("new");
        document.title = "(" + p + ") " + y
      }
      else{
        D.html("").removeClass("new");
        document.title = y
      }
      if (u != p) {
        x = true
      }
      u = p
    }

    function A() {
      m = false;
      v = false;
      var p = setTimeout(function () {
        clearTimeout(p);
        v = true;
        if (m) {
          A()
        }
      }, q.interval);
      h.get(q.url + "/check" + q.suffix, function (t) {
        if (!t.status) {
          w(t.data)
        }
        if (v) {
          A()
        }
        m = true
      }, "jsonp")
    }

    function z() {
      s.show();
      if (false === x || C) {
        return
      }
      s.html('<li class="loader"></li>');
      C = true;
      h.get(q.url + "/dump" + q.suffix, function (G) {
        if (!G.status && G.data.event.length > 0) {
          s.html("");
          D.html(G.data.count);
          for (var t = 0; t < G.data.event.length; t++) {
            var F = G.data.event[t], p = '<li class="msg" data-id="' + F.id + '" data-url="' + F.url + '"><a href="#" title="忽略" class="i-cancel right">✕</a><span class="right">' + F.createdDate + "</span>" + F.sentence + (F.isSelf ? "" : "<cite>" + F.title + "</cite>") + "</li>";
            h("a", h(p).appendTo(s).click(function (I, H) {
              H = H ? H : h(this).data("url");
              if (h("cite", this).length == 0 && h("a.trigger", this).length > 0) {
                H = h("a.trigger", this).attr("href")
              }
              h.get(q.url + "/view" + q.suffix, {id: h(this).data("id")}, function (J) {
                if (!J.status) {
                  w(J.data);
                  x = true
                }
                window.location.href = H
              }, "jsonp")
            })).click(function (J) {
              var I = h(this), H = I.parents("li.msg");
              if (I.hasClass("i-cancel")) {
                J.stopImmediatePropagation();
                h.get(q.url + "/view" + q.suffix, {id: H.data("id")}, function (K) {
                  if (!K.status) {
                    w(K.data);
                    x = true;
                    if (0 == K.data) {
                      h('<li class="no-msg">暂无未读消息</li>').prependTo(s);
                      h("a.ignore", s).remove();
                      h("a.view", s).css({width: 320, "border-right": "none"})
                    }
                  }
                }, "jsonp");
                H.remove()
              }
              else{
                H.trigger("click", [I.attr("href")])
              }
              return false
            })
          }
          h("a.ignore", h('<li class="all"><a class="view" href="' + o + '">查看全部</a><a class="ignore" href="#">忽略全部</a></li>').appendTo(s)).click(function () {
            var H = h(this).parents("li.all");
            h.get(q.url + "/viewAll" + q.suffix, function (I) {
              if (!I.status) {
                w(0);
                x = true;
                h("li.msg", s.hide()).remove();
                n.removeClass("current");
                h('<li class="no-msg">暂无未读消息</li>').insertBefore(H.html('<a href="' + o + '" style="width: 100%; border-right: none">查看全部</a>'))
              }
            }, "jsonp");
            h(this).closet(".has-dropdown").removeClass("active");
            return false
          })
        }
        else{
          s.html('<li class="no-msg">暂无未读消息</li><li class="all"><a href="' + o + '" style="width: 100%; border-right: none">查看全部</a></li>')
        }
        x = false;
        C = false
      }, "jsonp")
    }

    A();
    B.blur(function () {
      var p = setInterval(function () {
        if (0 == h("a:focus", s).length) {
          s.hide();
          n.removeClass("current");
          clearInterval(p);
          p = null
        }
      }, 100)
    }).click(function () {
      if (n.hasClass("active")) {
        A();
        z()
      }
      else{
        s.hide();
        n.removeClass("active")
      }
    });
    s.hover(function () {
      n.addClass("current")
    }, function () {
      n.removeClass("current")
    })
  };
  h.fn.highlightTag = function (n) {
    var m = [], o = h(this), p = h.extend({url: "", selector: "", className: "", ignore: []}, n), q = o.data("current");
    if (!!q && h.inArray(q, p.ignore) < 0) {
      p.ignore.push(q + "")
    }
    h.get(p.url, function (r) {
      if (!r.status) {
        m = r.data;
        o.trigger("update")
      }
    }, "jsonp");
    o.bind("follow", function (s, r) {
      r = parseInt(r);
      if (h.inArray(r, m) < 0) {
        m.push(r);
        o.trigger("update")
      }
    });
    o.bind("unfollow", function (t, s) {
      s = parseInt(s);
      var r = h.inArray(s, m);
      if (r >= 0) {
        m.splice(r, 1);
        o.trigger("update")
      }
    });
    o.bind("update", function () {
      h("article", this).removeClass(p.className);
      h(p.selector, this).each(function () {
        var r = h(this).data("tid");
        if (r && h.inArray(r, m) >= 0 && h.inArray(r + "", p.ignore) < 0) {
          h(this).parents("article").addClass(p.className)
        }
      })
    })
  };
  var d = {}, a = {}, c = {};
  h.fn.tagPopup = function (n, m) {
    var q, t, s;

    function p(v, w) {
      var u = '<div class="pop-tag"><div class="pop-head">' + (v.iconUrl ? '<h4 class="tag-img" style="background-image: url(' + v.iconUrl + ')">' : "<h4>") + v.name + '</h4></div><div class="pop-body">' + (v.isEdited ? v.excerpt : "<cite>目前还没有关于这个标签的解释</cite>") + '</div><div class="pop-foot form-action"><span class="left"><a href="' + v.url + '">查看</a> &bull; <a href="' + v.editUrl + '">编辑</a> &bull; ' + v.followersWord + ' 人关注</span><a href="#" class="btn btn-default btn-xs tag-follow' + (v.isFollowed ? " followed" : "") + '">' + (v.isFollowed ? "取消关注" : "加关注") + "</a></div></div>";
      h(".pop-tag", "body").remove();
      h("a.tag-follow", h(u).data("tid", v.id).appendTo("body").css({top: t, left: s}).hover(function () {
        c[h(this).data("tid")] = h(this).prev().get(0)
      }, function () {
        c[h(this).data("tid")] = null;
        h(this).remove()
      })).click(function () {
        var x = h(this), y = x.parents(".pop-tag").data("tid");
        h.post(n, {"do": "follow", cancel: x.hasClass("followed") ? 1 : 0, id: y}, function (z) {
          if (!z.status) {
            x.toggleClass("followed");
            if (x.hasClass("followed")) {
              x.html("取消关注");
              d[z.data.id].isFollowed = true;
              if (m) {
                h(m).trigger("follow", [z.data.id])
              }
            }
            else{
              x.html("加关注");
              d[z.data.id].isFollowed = false;
              if (m) {
                h(m).trigger("unfollow", [z.data.id])
              }
            }
            d[z.data.id].followersWord = z.data.followersWord;
            h(".pop-foot .left strong", x.parents(".pop-tag")).html(z.data.followersWord)
          }
        }, "json");
        return false
      })
    }

    function o(w, v) {
      var u = '<div class="pop-tag"><div class="pop-head"><h4>' + w.substring(1, w.length) + '</h4></div><div class="pop-body"><cite>此标签尚未创建</cite></div></div>';
      h(".pop-tag", "body").remove();
      h(u).data("tid", w).appendTo("body").css({top: t, left: s}).hover(function () {
        c[h(this).data("tid")] = h(this).prev().get(0)
      }, function () {
        c[h(this).data("tid")] = null;
        h(this).remove()
      })
    }

    function r(v, u) {
      h(".pop-tag", "body").remove();
      h('<div class="pop-tag"><div class="loader"></div></div>').data("tid", v).appendTo("body").css({top: t, left: s}).hover(function () {
        c[h(this).data("tid")] = h(this).prev()
      }, function () {
        c[h(this).data("tid")] = null
      })
    }

    if (m) {
      h(m).bind({follow: function (v, u) {
        if (d[u]) {
          d[u].isFollowed = true
        }
      }, unfollow: function (v, u) {
        if (d[u]) {
          d[u].isFollowed = false
        }
      }})
    }
    this.hover(function () {
      var u = this, w = h(u).data("tid");
      c[w] = u;
      q = h(u);
      t = q.offset().top + q.height(), s = q.offset().left;
      var v = setTimeout(function () {
        if (c[w] != u) {
          return
        }
        if (a[w]) {
          r(w, u);
          return
        }
        if (d[w]) {
          if (0 == h(u).next(".pop-tag").length || h(".loader", h(u).next(".pop-tag")).length > 0) {
            p(d[w], u)
          }
          return
        }
        a[w] = true;
        r(w, u);
        h.getJSON(n, {"do": "show", id: w}, function (A) {
          if (!A.status) {
            if ("object" == typeof(A.data)) {
              var x = A.data, y = "@" + x.name, z = c[y] ? y : x.id;
              if (c[z]) {
                p(x, c[z])
              }
              a[z] = false;
              d[z] = x
            }
            else{
              var z = A.data;
              if (c[z]) {
                o(z, c[z])
              }
              a[z] = false
            }
          }
        });
        clearTimeout(v)
      }, 1000)
    }, function (w) {
      var u = this, x = h(u).data("tid"), v = h(w.relatedTarget);
      v = v.hasClass("pop-tag") ? v : v.parents(".pop-tag");
      c[x] = null;
      if (!v.length || v.data("tid") != x) {
        h(".pop-tag", "body").remove()
      }
    })
  };
  h.fn.modal = function (v) {
    var n = h.extend({title: "", cancel: "取消", onShow: null, auto: false, action: "", data: null, onAction: null, scroll: false, onClose: null, onCancel: null}, v), o = h('<div class="pop-overlay"></div>').appendTo(document.body), u = this;
    o.css({opacity: 0.5, position: "absolute", backgroundColor: "#000000", left: 0, top: 0, width: "100%", height: h(document).height(), "z-index": 10000});
    var m = h('<div class="pop-window' + (n.auto ? " pop-auto" : "") + '"></div>').appendTo(document.body).css("position", "absolute");
    var r = h('<div class="pop-head"><a class="i-cancel close" href="#">&times;</a><h4>' + n.title + "</h4></div>").appendTo(m), q = h('<div class="pop-body form"></div>').append(u).appendTo(m), s = h('<div class="pop-foot form-action"><input type="button" class="btn btn-default btn-l cancel" value="' + n.cancel + '" />' + (n.action ? '<input type="button" class="btn btn-primary btn-l action" value="' + n.action + '" />' : "") + "</div>").appendTo(m);
    m.css({top: h(window).scrollTop() + Math.ceil((h(window).height() - h(u).outerHeight()) / 3), left: Math.ceil((h(document).width() - h(u).outerWidth()) / 2), "z-index": 10001}).bind("close", {container: m}, function (t) {
      o.remove();
      m.remove();
      if (n.onClose) {
        n.onClose.call(u, t.data.container)
      }
    }).bind("action", {foot: s}, function (t) {
      h(".action", t.data.foot).trigger("click")
    });
    h(window).resize(function () {
      m.css({top: h(window).scrollTop() + Math.ceil((h(window).height() - h(u).outerHeight()) / 3), left: Math.ceil((h(document).width() - h(u).outerWidth()) / 2)});
      o.css("height", h(document).height())
    });
    if (n.scroll) {
      h(window).scroll(function () {
        m.css({top: h(window).scrollTop() + Math.ceil((h(window).height() - h(u).outerHeight()) / 3), left: Math.ceil((h(document).width() - h(u).outerWidth()) / 2)})
      })
    }
    if ("function" == typeof(n.onShow)) {
      n.onShow.call(u, m)
    }
    if ("function" == typeof(n.onAction)) {
      h(".action", s).bind("click", {container: m, body: u, callback: n.onAction, data: n.data}, function (t) {
        t.data.callback.call(t.data.body, t.data.container, t.data.data);
        return false
      })
    }
    function p(t) {
      if (n.onCancel) {
        n.onCancel.call(u, t.data.container)
      }
      t.data.container.trigger("close");
      return false
    }

    h(".close", r).bind("click", {container: m}, p);
    h(".cancel", s).bind("click", {container: m}, p);
    return this
  };
  var g = 0, l = [
    [/^http:\/\/jsfiddle\.net\/([_a-z0-9-\/]+)$/i, function (n, m) {
      if ("/" == m[m.length - 1]) {
        m = m.substring(0, m.length - 1)
      }
      m = "http://jsfiddle.net/" + m + "/embedded/";
      return'<iframe style="width: 100%; height: 300px" src="' + m + '" allowfullscreen="allowfullscreen" frameborder="0"></iframe>'
    }],
    [/^https?:\/\/gist\.github\.com\/([0-9]+)$/i, function (p, n) {
      var r = "https://gist.github.com/" + n + ".json?callback=special_" + g, o = h('<iframe id="special-gist' + n + '" style="width: 100%; height: 300px" src="about:blank" frameborder="0"></iframe>').insertAfter(this), s = o[0], q = s.contentWindow ? s.contentWindow.document : s.contentDocument ? s.contentDocument : s.document, m = q.createElement("script");
      s.contentWindow["special_" + g] = function (y) {
        var u = y.div.match(/<div\s+id="(gist[0-9]+)"/i), v = document.getElementById("special-" + u[1]), x = v.contentWindow ? v.contentWindow.document : v.contentDocument ? v.contentDocument : v.document, w = x.createElement("link");
        w.rel = "stylesheet";
        w.href = y.stylesheet;
        x.head.appendChild(w);
        var t = setInterval(function () {
          if (x.styleSheets.length > 0) {
            h("body", x).css({padding: 0, margin: 0, overflow: "hidden"}).html(y.div);
            h(v).height(h(".gist", x).height()).css({border: "none", background: "none"});
            clearInterval(t);
            t = null
          }
        }, 100)
      };
      m.type = "text/javascript";
      m.src = r;
      q.body.appendChild(m);
      h("body", q);
      g++;
      return""
    }],
    [/^http:\/\/runjs\.cn\/detail\/([_0-9a-z-]+)$/i, function (m, p) {
      var n = "http://runjs.cn/gist/" + p + "/all";
      iframe = h('<iframe id="special-runjs' + p + '" style="width: 100%; height: 300px" src="about:blank" frameborder="0"></iframe>').insertAfter(this);
      io = iframe[0], doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document, script = doc.createElement("script");
      proto = doc.prototype ? doc.prototype : doc.__proto__;
      proto.write = function (q) {
        h(q).appendTo(doc.body)
      };
      script.type = "text/javascript";
      script.src = n;
      doc.body.appendChild(script);
      function o() {
        h("body", doc).css("margin", 0);
        h(".runjs_gist", doc).css("border", "none");
        h(".gist_content", doc).css("font-size", "14px")
      }

      script.onreadystatechange = o;
      script.onload = o;
      return""
    }]
  ];

  function k(p, n, o) {
    if ("undefined" == typeof(p) || 0 == p.length) {
      return false
    }
    var m = p.match(n);
    if (null !== m) {
      return o.apply(this, m)
    }
    return false
  }

  h.fn.specialUrl = function () {
    h("a", this).each(function () {
      var s = h(this), p = s.attr("href");
      for (var r = 0; r < l.length; r++) {
        var o = l[r][0], q = l[r][1];
        if (o instanceof Array) {
          for (var n = 0; n < o.length; n++) {
            var m = k.call(this, p, o[n], q);
            if (false !== m) {
              s.replaceWith(m);
              return
            }
          }
        }
        else{
          var m = k.call(this, p, o, q);
          if (false !== m) {
            s.replaceWith(m);
            return
          }
        }
      }
    })
  };
  /*
   * Naked Password Version 0.2.3
   * http://www.nakedpassword.com
   *
   * Copyright 2010, Platform45
   * Dual licensed under the MIT or GPL Version 2 licenses.
   */
  h.fn.nakedPassword = function (m) {
    return this.each(function () {
      var q = {path: "images/", width: 30, height: 28}, p = h.extend(q, m);

      function o() {
        var z = y(h(this).val());
        u(h(this).attr("id"), z)
      }

      function u(z, A) {
        for (r = 0; r <= 5; r++) {
          if (r == A) {
            h("#" + z + "pic" + r).fadeIn()
          }
          else{
            h("#" + z + "pic" + r).fadeOut()
          }
        }
      }

      function y(z) {
        return 0 + +(z.length > 5) + +(/[a-z]/.test(z) && /[A-Z]/.test(z)) + +(/\d/.test(z) && /\D/.test(z)) + +(/[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/.test(z) && /\w/.test(z)) + +(z.length > 12)
      }

      var v = h(this).position(), s = h(this).outerHeight(), t = h(this).outerWidth(), x = ((s - 6) / p.height) * p.width, n = s - 6, w = {position: "absolute", display: "none", opacity: 1, left: (v.left + t - (x + 3)) + "px", top: (v.top + 3) + "px", margin: "0px", marginTop: (h.browser.safari ? 3 : 1) + "px"};
      for (var r = 0; r <= 5; r++) {
        h(this).after("<div style='display:none;' id='" + h(this).attr("id") + "pic" + r + "'><img src='" + p.path + r + ".png' width='" + x + "' height='" + n + "px' /></div>");
        h("#" + h(this).attr("id") + "pic" + r).css(w)
      }
      h(this).bind("keyup", o).bind("blur", o)
    })
  };
  (function () {
    var m = (h.browser.msie ? "paste" : "input") + ".mask";
    var n = (window.orientation != undefined);
    h.mask = {definitions: {"9": "[0-9]", a: "[A-Za-z]", "*": "[A-Za-z0-9]"}};
    h.fn.extend({caret: function (q, o) {
      if (this.length == 0) {
        return
      }
      if (typeof q == "number") {
        o = (typeof o == "number") ? o : q;
        return this.each(function () {
          if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(q, o)
          }
          else{
            if (this.createTextRange) {
              var r = this.createTextRange();
              r.collapse(true);
              r.moveEnd("character", o);
              r.moveStart("character", q);
              r.select()
            }
          }
        })
      }
      else{
        if (this[0].setSelectionRange) {
          q = this[0].selectionStart;
          o = this[0].selectionEnd
        }
        else{
          if (document.selection && document.selection.createRange) {
            var p = document.selection.createRange();
            q = 0 - p.duplicate().moveStart("character", -100000);
            o = q + p.text.length
          }
        }
        return{begin: q, end: o}
      }
    }, unmask: function () {
      return this.trigger("unmask")
    }, mask: function (q, u) {
      if (!q && this.length > 0) {
        var r = h(this[0]);
        var t = r.data("tests");
        return h.map(r.data("buffer"), function (x, w) {
          return t[w] ? x : null
        }).join("")
      }
      u = h.extend({placeholder: "_", completed: null}, u);
      var p = h.mask.definitions;
      var t = [];
      var v = q.length;
      var s = null;
      var o = q.length;
      h.each(q.split(""), function (w, x) {
        if (x == "?") {
          o--;
          v = w
        }
        else{
          if (p[x]) {
            t.push(new RegExp(p[x]));
            if (s == null) {
              s = t.length - 1
            }
          }
          else{
            t.push(null)
          }
        }
      });
      return this.each(function () {
        var F = h(this);
        var A = h.map(q.split(""), function (J, I) {
          if (J != "?") {
            return p[J] ? u.placeholder : J
          }
        });
        var D = false;
        var H = F.val();
        F.data("buffer", A).data("tests", t);
        function E(I) {
          while (++I <= o && !t[I]) {
          }
          return I
        }

        function z(K) {
          while (!t[K] && --K >= 0) {
          }
          for (var J = K; J < o; J++) {
            if (t[J]) {
              A[J] = u.placeholder;
              var I = E(J);
              if (I < o && t[J].test(A[I])) {
                A[J] = A[I]
              }
              else{
                break
              }
            }
          }
          C();
          F.caret(Math.max(s, K))
        }

        function w(M) {
          for (var K = M, L = u.placeholder; K < o; K++) {
            if (t[K]) {
              var I = E(K);
              var J = A[K];
              A[K] = L;
              if (I < o && t[I].test(J)) {
                L = J
              }
              else{
                break
              }
            }
          }
        }

        function B(J) {
          var K = h(this).caret();
          var I = J.keyCode;
          D = (I < 16 || (I > 16 && I < 32) || (I > 32 && I < 41));
          if ((K.begin - K.end) != 0 && (!D || I == 8 || I == 46)) {
            x(K.begin, K.end)
          }
          if (I == 8 || I == 46 || (n && I == 127)) {
            z(K.begin + (I == 46 ? 0 : -1));
            return false
          }
          else{
            if (I == 27) {
              F.val(H);
              F.caret(0, y());
              return false
            }
          }
        }

        function G(L) {
          if (D) {
            D = false;
            return(L.keyCode == 8) ? false : null
          }
          L = L || window.event;
          var I = L.charCode || L.keyCode || L.which;
          var N = h(this).caret();
          if (L.ctrlKey || L.altKey || L.metaKey) {
            return true
          }
          else{
            if ((I >= 32 && I <= 125) || I > 186) {
              var K = E(N.begin - 1);
              if (K < o) {
                var M = String.fromCharCode(I);
                if (t[K].test(M)) {
                  w(K);
                  A[K] = M;
                  C();
                  var J = E(K);
                  h(this).caret(J);
                  if (u.completed && J == o) {
                    u.completed.call(F)
                  }
                }
              }
            }
          }
          return false
        }

        function x(K, I) {
          for (var J = K; J < I && J < o; J++) {
            if (t[J]) {
              A[J] = u.placeholder
            }
          }
        }

        function C() {
          return F.val(A.join("")).val()
        }

        function y(J) {
          var N = F.val();
          var M = -1;
          for (var I = 0, L = 0; I < o; I++) {
            if (t[I]) {
              A[I] = u.placeholder;
              while (L++ < N.length) {
                var K = N.charAt(L - 1);
                if (t[I].test(K)) {
                  A[I] = K;
                  M = I;
                  break
                }
              }
              if (L > N.length) {
                break
              }
            }
            else{
              if (A[I] == N[L] && I != v) {
                L++;
                M = I
              }
            }
          }
          if (!J && M + 1 < v) {
            F.val("");
            x(0, o)
          }
          else{
            if (J || M + 1 >= v) {
              C();
              if (!J) {
                F.val(F.val().substring(0, M + 1))
              }
            }
          }
          return(v ? I : s)
        }

        if (!F.attr("readonly")) {
          F.one("unmask", function () {
            F.unbind(".mask").removeData("buffer").removeData("tests")
          }).bind("focus.mask", function () {
            H = F.val();
            var I = y();
            C();
            setTimeout(function () {
              if (I == q.length) {
                F.caret(0, I)
              }
              else{
                F.caret(I)
              }
            }, 0)
          }).bind("blur.mask", function () {
            y();
            if (F.val() != H) {
              F.change()
            }
          }).bind("keydown.mask", B).bind("keypress.mask", G).bind(m, function () {
            setTimeout(function () {
              F.caret(y(true))
            }, 0)
          })
        }
        y()
      })
    }})
  })();
  (function (m) {
    m.fn.sticky = function (n) {
      var p = {topSpacing: "", margin: false, className: "is-sticky"};
      var q = m.extend(p, n);
      return this.each(function () {
        var s = q.topSpacing, o = m(this), r = o.attr("id"), t = false;
        o.wrapAll('<div id="' + r + 'StickyWrapper"></div>').css("width", o.width());
        var u = o.parent();
        m(window).scroll(function () {
          var y = m(window).scrollTop(), w = u.offset().top, v = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight, z = o.outerHeight(), x = s;
          if (v - s < z) {
            x = s - (z - v + s)
          }
          if (y <= w - x) {
            if (q.margin) {
              o.css("marginTop", 0)
            }
            else{
              if (t) {
                o.css("position", "").css("top", "").removeClass(q.className);
                t = false
              }
            }
          }
          else{
            if (q.margin) {
              o.css("marginTop", y - w + x)
            }
            else{
              if (!t && y >= w - x) {
                o.css("position", "fixed").css("top", x).addClass(q.className);
                t = true
              }
            }
          }
        })
      })
    }
  })(jQuery);
  /* http://mths.be/placeholder v2.0.7 by @mathias */
  (function (t, v, q) {
    var m = "placeholder" in v.createElement("input");
    var r = "placeholder" in v.createElement("textarea");
    var w = q.fn;
    var p = q.valHooks;
    var n = q.propHooks;
    var y;
    var x;
    if (m && r) {
      x = w.placeholder = function () {
        return this
      };
      x.input = x.textarea = true
    }
    else{
      x = w.placeholder = function () {
        var A = this;
        A.filter((m ? "textarea" : ":input") + "[placeholder]").not(".placeholder").bind({"focus.placeholder": o, "blur.placeholder": s}).data("placeholder-enabled", true).trigger("blur.placeholder");
        return A
      };
      x.input = m;
      x.textarea = r;
      y = {get: function (B) {
        var A = q(B);
        var C = A.data("placeholder-password");
        if (C) {
          return C[0].value
        }
        return A.data("placeholder-enabled") && A.hasClass("placeholder") ? "" : B.value
      }, set: function (B, D) {
        var A = q(B);
        var C = A.data("placeholder-password");
        if (C) {
          return C[0].value = D
        }
        if (!A.data("placeholder-enabled")) {
          return B.value = D
        }
        if (D == "") {
          B.value = D;
          if (B != z()) {
            s.call(B)
          }
        }
        else{
          if (A.hasClass("placeholder")) {
            o.call(B, true, D) || (B.value = D)
          }
          else{
            B.value = D
          }
        }
        return A
      }};
      if (!m) {
        p.input = y;
        n.value = y
      }
      if (!r) {
        p.textarea = y;
        n.value = y
      }
      q(function () {
        q(v).delegate("form", "submit.placeholder", function () {
          var A = q(".placeholder", this).each(o);
          setTimeout(function () {
            A.each(s)
          }, 10)
        })
      });
      q(t).bind("beforeunload.placeholder", function () {
        q(".placeholder").each(function () {
          this.value = ""
        })
      })
    }
    function u(B) {
      var A = {};
      var C = /^jQuery\d+$/;
      q.each(B.attributes, function (E, D) {
        if (D.specified && !C.test(D.name)) {
          A[D.name] = D.value
        }
      });
      return A
    }

    function o(B, C) {
      var A = this;
      var D = q(A);
      if (A.value == D.attr("placeholder") && D.hasClass("placeholder")) {
        if (D.data("placeholder-password")) {
          D = D.hide().next().show().attr("id", D.removeAttr("id").data("placeholder-id"));
          if (B === true) {
            return D[0].value = C
          }
          D.focus()
        }
        else{
          A.value = "";
          D.removeClass("placeholder");
          A == z() && A.select()
        }
      }
    }

    function s() {
      var E;
      var A = this;
      var D = q(A);
      var C = this.id;
      if (A.value == "") {
        if (A.type == "password") {
          if (!D.data("placeholder-textinput")) {
            try {
              E = D.clone().attr({type: "text"})
            } catch (B) {
              E = q("<input>").attr(q.extend(u(this), {type: "text"}))
            }
            E.removeAttr("name").data({"placeholder-password": D, "placeholder-id": C}).bind("focus.placeholder", o);
            D.data({"placeholder-textinput": E, "placeholder-id": C}).before(E)
          }
          D = D.removeAttr("id").hide().prev().attr("id", C).show()
        }
        D.addClass("placeholder");
        D[0].value = D.attr("placeholder")
      }
      else{
        D.removeClass("placeholder")
      }
    }

    function z() {
      try {
        return v.activeElement
      } catch (A) {
      }
    }
  }(this, document, jQuery));
  jQuery.fn.sortElements = (function () {
    var m = [].sort;
    return function (o, p) {
      p = p || function () {
        return this
      };
      var n = this.map(function () {
        var r = p.call(this), q = r.parentNode, s = q.insertBefore(document.createTextNode(""), r.nextSibling);
        return function () {
          if (q === this) {
            throw new Error("You can't sort elements if any one is a descendant of another.")
          }
          q.insertBefore(this, s);
          q.removeChild(s)
        }
      });
      return m.call(this, o).each(function (q) {
        n[q].call(p.call(this))
      })
    }
  })();
  h.extend({highlight: function (m, u, s, r) {
    if (m.nodeType === 3) {
      var p = m.data.match(u);
      if (p) {
        var n = document.createElement(s || "span");
        n.className = r || "highlight";
        var t = m.splitText(p.index);
        t.splitText(p[0].length);
        var q = t.cloneNode(true);
        n.appendChild(q);
        t.parentNode.replaceChild(n, t);
        return 1
      }
    }
    else{
      if ((m.nodeType === 1 && m.childNodes) && !/(script|style)/i.test(m.tagName) && !(m.tagName === s.toUpperCase() && m.className === r)) {
        for (var o = 0; o < m.childNodes.length; o++) {
          o += h.highlight(m.childNodes[o], u, s, r)
        }
      }
    }
    return 0
  }});
  h.fn.highlight = function (r, n) {
    var p = {className: "highlight", element: "span", caseSensitive: false, wordsOnly: false};
    h.extend(p, n);
    if (r.constructor === String) {
      r = [r]
    }
    r = h.grep(r, function (t, s) {
      return t != ""
    });
    r = h.map(r, function (t, s) {
      return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    });
    if (r.length == 0) {
      return this
    }
    var m = p.caseSensitive ? "" : "i";
    var q = "(" + r.join("|") + ")";
    if (p.wordsOnly) {
      q = "\\b" + q + "\\b"
    }
    var o = new RegExp(q, m);
    return this.each(function () {
      h.highlight(this, o, p.element, p.className)
    })
  };
  h.fn.searchAutoComplete = function (A) {
    var q = h.extend({url: "", insertAfter: "", searchUrl: "", boxId: "search-box", askUrl: "", ask: ""}, A), x = "", y = this, m = {}, o, w = false, s = false, r = h(q.ask), z = h('<ul id="' + q.boxId + '"></ul>').insertAfter(q.insertAfter).hide().hover(function () {
      s = true
    }, function () {
      s = false
    });

    function p(D, C) {
      var t = new RegExp("[\\w\\u3300-\\u33ff\\u3400-\\u4d8f\\u4e00-\\u9fff\\+\\-\\.#/]+", "g"), B = D.match(t);
      if (null == B) {
        return""
      }
      return B.join(C)
    }

    function n(t) {
      return h.grep(h.map(t.split(/( |　)/), function (B) {
        return p(B, "")
      }), function (B) {
        return B.length > 0
      }).join(" ")
    }

    function u(D) {
      v();
      if (!D.status) {
        var B = "";
        if (!!D.data.special) {
          v(D.data.special)
        }
        for (var t = 0; t < D.data.result.length; t++) {
          var C = D.data.result[t];
          if ("question" == C.type) {
            B += '<li class="q"><a href="' + C.url + '">' + C.title + "</a><span>" + (C.answers > 0 ? C.answers + " 个回答" : "") + "</span></li>"
          }
          else{
            if ("tag" == C.type) {
              B += '<li class="t"><a href="' + C.url + '" class="tag' + (C.iconUrl ? ' tag-img" style="background-image: url(' + C.iconUrl + ");" : "") + '">' + C.name + "</a><span>";
              if (C.similarTags) {
                B += "别称 " + C.similarTags.join("，")
              }
              if (C.questions > 0) {
                B += (C.similarTags ? "，" : "") + C.questions + " 个问题"
              }
              B += "</span></li>"
            }
            else{
              if ("user" == C.type) {
                B += '<li class="u"><a href="' + C.url + '"><img class="avatar-24" src="' + C.avatarUrl + '" />' + C.name + "</a><span>" + C.excerpt + "</span></li>"
              }
            }
          }
        }
        h(B).prependTo(z);
        h("li.q,li.t,li.u", z).each(function () {
          h(this).click(function () {
            window.location.href = h("a", this).attr("href")
          })
        })
      }
    }

    function v(B) {
      if (!!B) {
        var D = n(B[1]), t = B[0], C = '<li class="s"><a href="' + t.url + "/search?q=" + encodeURIComponent(D) + '">在标签 "' + t.name + '" 下' + (D.length > 0 ? "搜索: " + D : "搜索关键字") + "</a></li>";
        r.attr("href", q.askUrl + "?tag=" + encodeURIComponent(t.name) + "&summary=" + encodeURIComponent(D))
      }
      else{
        var E = n(y.val()), C = '<li class="s"><a href="' + q.searchUrl + "?q=" + encodeURIComponent(E) + '">' + (E.length ? "搜索: " + E : "搜索关键字") + "</a></li>";
        r.attr("href", E.length > 0 ? q.askUrl + "?summary=" + encodeURIComponent(E) : q.askUrl)
      }
      z.html(C);
      h("li.s", z).each(function () {
        h(this).click(function () {
          window.location.href = h("a:last", this).attr("href")
        })
      })
    }

    this.focus(function () {
      w = true;
      v();
      o = setInterval(function () {
        var t = n(y.val());
        if (t != x) {
          if (t.length > 0) {
            if (m[t]) {
              u(m[t])
            }
            else{
              h.get(q.url, {q: t}, function (B) {
                m[t] = B;
                u(B)
              }, "jsonp")
            }
            z.show()
          }
          else{
            v();
            z.hide()
          }
          x = t
        }
      }, 200)
    }).blur(function (t) {
      w = s || false;
      if (o) {
        clearInterval(o);
        o = null
      }
      x = "";
      var B = setInterval(function () {
        if (!w && 0 == h("*:focus", z).length) {
          z.hide();
          clearTimeout(B);
          B = null
        }
      }, 100)
    }).keydown(function (C) {
      var B = h("li.current", z), t = C.charCode || C.keyCode || C.which;
      switch (t) {
        case 38:
          if (B.length > 0) {
            B.removeClass("current");
            B.prev().addClass("current")
          }
          else{
            h("li:last", z).addClass("current")
          }
          break;
        case 40:
          if (B.length > 0) {
            B.removeClass("current");
            B.next().addClass("current")
          }
          else{
            h("li:first", z).addClass("current")
          }
          break;
        default:
          break
      }
    });
    h(this).parents("form").submit(function () {
      var t = h("li.current", z);
      if (t.length > 0) {
        t.trigger("click");
        return false
      }
    })
  };
  h.fn.commonAutoComplete = function (x) {
    var p = h.extend({url: "", className: "common-search-list", currentClass: "current", preSelect: true, cache: true, searchParam: "q", insertAfter: null, button: null, onResult: function (y, t) {
      return y.data
    }, onLoading: null, onEmpty: "<li>没有任何结果</li>", onEnter: function () {
    }, resultsFormatter: function (t) {
    }}, x), u = "", v = this, m = {}, n, s = false, q = false, w = h('<ul class="' + p.className + '"></ul>').insertAfter(p.insertAfter ? p.insertAfter : this).hide().hover(function () {
      q = true
    }, function () {
      q = false
    }), o;

    function r(C, B) {
      var A = p.onResult(C, B), y = false;
      if (!A || 0 == A.length) {
        w.html(p.onEmpty);
        return
      }
      v.trigger("dropdown");
      w.html("");
      for (var t = 0; t < A.length; t++) {
        var z = h(p.resultsFormatter(A[t], B)).data("data", A[t]).appendTo(w).click(function () {
          var D = h(this).data("data");
          if (D) {
            p.onEnter.call(v, D);
            o = null;
            w.hide()
          }
        });
        if (!y && p.preSelect) {
          z.addClass(p.currentClass);
          o = A[t];
          y = true
        }
      }
    }

    if (p.button) {
      h(p.button).click(function () {
        if (o) {
          p.onEnter.call(v, o)
        }
        else{
          v.focus()
        }
        o = null;
        w.hide();
        return false
      })
    }
    this.focus(function () {
      s = true;
      n = setInterval(function () {
        var y = v.val();
        if (y != u) {
          w.show();
          o = null;
          if (y.length > 0) {
            if (p.onLoading) {
              p.onLoading.call(v)
            }
            if (m[y]) {
              r(m[y], y)
            }
            else{
              var t = {};
              t[p.searchParam] = y;
              h.get(p.url, t, function (z) {
                if (p.cache) {
                  m[y] = z
                }
                r(z, y)
              }, "jsonp")
            }
          }
          else{
            w.hide().html("")
          }
          u = y
        }
      }, 200)
    }).blur(function (t) {
      s = q || false;
      if (n) {
        clearInterval(n);
        n = null
      }
      u = "";
      var y = setTimeout(function () {
        if (!s) {
          w.hide()
        }
        clearTimeout(y);
        y = null
      }, 200)
    }).keydown(function (B) {
      var A = h("." + p.currentClass, w), t = B.charCode || B.keyCode || B.which;
      switch (t) {
        case 38:
          if (A.length > 0) {
            var z = A.prev();
            A.removeClass(p.currentClass);
            (z.length > 0 || !p.preSelect ? z : h("*:last", w)).addClass(p.currentClass)
          }
          else{
            h("*:last", w).addClass(p.currentClass)
          }
          break;
        case 40:
          if (A.length > 0) {
            var y = A.next();
            A.removeClass(p.currentClass);
            (y.length > 0 || !p.preSelect ? y : h("*:first", w)).addClass(p.currentClass)
          }
          else{
            h("*:first", w).addClass(p.currentClass)
          }
          break;
        case 13:
          if (A.length > 0) {
            A.trigger("click")
          }
          else{
            if (!p.preSelect) {
              p.onEnter.call(v, v.val());
              o = null;
              w.hide()
            }
          }
          return false;
        default:
          break
      }
      o = h("." + p.currentClass, w).data("data")
    })
  };
  h.fn.frameFileUpload = function (m) {
    var n = h.extend({url: "", trigger: "", data: null, callback: "frameFileUploadComplete", onUpload: null, onComplete: null, onChange: null}, m), o = this.selector;
    window[n.callback] = function (p) {
      h(o).removeAttr("disabled").val("");
      if (n.onComplete) {
        n.onComplete(p)
      }
    };
    this.each(function (q) {
      var r = h(this), u = "upload-frame-" + q, s = h('<iframe style="display:none;" id="' + u + '" src="about:blank"></iframe>').insertAfter(r);

      function p() {
        var x = h(o), y = h('<form id="upload-form" action="' + n.url + '" method="post" enctype="multipart/form-data"></form>'), w = x.clone(true).attr("disabled", "disabled").val(""), B = s[0], A = B.contentWindow ? B.contentWindow.document : B.contentDocument ? B.contentDocument : B.document;
        if (!!n.data) {
          if ("string" == typeof(n.data)) {
            var z = y.attr("action");
            y.attr("action", z + (z.indexOf("?") > 0 ? "&" + n.data : "?" + n.data))
          }
          else{
            for (var v in n.data) {
              h('<input type="hidden" name="' + v + '" />').val(n.data[v]).appendTo(y)
            }
          }
        }
        w.insertBefore(x);
        y.append(x);
        h("body", A).html("").append(y);
        y.submit();
        if (n.onUpload) {
          n.onUpload.call(x)
        }
        return false
      }

      if (!!n.trigger) {
        h(n.trigger).click(p)
      }
      if (n.onChange) {
        r.change(function () {
          n.onChange.call(this, p)
        })
      }
    })
  };
  h.fn.topLink = function (m) {
    m = jQuery.extend({min: 1, fadeSpeed: 200}, m);
    return this.each(function () {
      var n = h(this);
      n.hide();
      h(window).scroll(function () {
        if (h(window).scrollTop() >= m.min) {
          n.fadeIn(m.fadeSpeed)
        }
        else{
          n.fadeOut(m.fadeSpeed)
        }
      })
    })
  }
})(jQuery);
/*
 * jQuery.ScrollTo
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 4/09/2012
 *
 * @projectDescription Easy element scrolling using jQuery.
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * @author Ariel Flesler
 * @version 1.4.3.1
 *
 * @id jQuery.scrollTo
 * @id jQuery.fn.scrollTo
 * @param {String, Number, DOMElement, jQuery, Object} target Where to scroll the matched elements.
 *	  The different options for target are:
 *		- A number position (will be applied to all axes).
 *		- A string position ('44', '100px', '+=90', etc ) will be applied to all axes
 *		- A jQuery/DOM element ( logically, child of the element to scroll )
 *		- A string selector, that will be relative to the element to scroll ( 'li:eq(2)', etc )
 *		- A hash { top:x, left:y }, x and y can be any kind of number/string like above.
 *		- A percentage of the container's dimension/s, for example: 50% to go to the middle.
 *		- The string 'max' for go-to-end. 
 * @param {Number, Function} duration The OVERALL length of the animation, this argument can be the settings object instead.
 * @param {Object,Function} settings Optional set of settings or the onAfter callback.
 *	 @option {String} axis Which axis must be scrolled, use 'x', 'y', 'xy' or 'yx'.
 *	 @option {Number, Function} duration The OVERALL length of the animation.
 *	 @option {String} easing The easing method for the animation.
 *	 @option {Boolean} margin If true, the margin of the target element will be deducted from the final position.
 *	 @option {Object, Number} offset Add/deduct from the end position. One number for both axes or { top:x, left:y }.
 *	 @option {Object, Number} over Add/deduct the height/width multiplied by 'over', can be { top:x, left:y } when using both axes.
 *	 @option {Boolean} queue If true, and both axis are given, the 2nd axis will only be animated after the first one ends.
 *	 @option {Function} onAfter Function to be called after the scrolling ends. 
 *	 @option {Function} onAfterFirst If queuing is activated, this function will be called after the first scrolling ends.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @desc Scroll to a fixed position
 * @example $('div').scrollTo( 340 );
 *
 * @desc Scroll relatively to the actual position
 * @example $('div').scrollTo( '+=340px', { axis:'y' } );
 *
 * @desc Scroll using a selector (relative to the scrolled element)
 * @example $('div').scrollTo( 'p.paragraph:eq(2)', 500, { easing:'swing', queue:true, axis:'xy' } );
 *
 * @desc Scroll to a DOM element (same for jQuery object)
 * @example var second_child = document.getElementById('container').firstChild.nextSibling;
 *			$('#container').scrollTo( second_child, { duration:500, axis:'x', onAfter:function(){
 *				alert('scrolled!!');																   
 *			}});
 *
 * @desc Scroll on both axes, to different values
 * @example $('div').scrollTo( { top: 300, left:'+=200' }, { axis:'xy', offset:-20 } );
 */
(function (c) {
  var a = c.scrollTo = function (f, e, d) {
    c(window).scrollTo(f, e, d)
  };
  a.defaults = {axis: "xy", duration: parseFloat(c.fn.jquery) >= 1.3 ? 0 : 1, limit: true};
  a.window = function (d) {
    return c(window)._scrollable()
  };
  c.fn._scrollable = function () {
    return this.map(function () {
      var e = this, d = !e.nodeName || c.inArray(e.nodeName.toLowerCase(), ["iframe", "#document", "html", "body"]) != -1;
      if (!d) {
        return e
      }
      var f = (e.contentWindow || e).document || e.ownerDocument || e;
      return/webkit/i.test(navigator.userAgent) || f.compatMode == "BackCompat" ? f.body : f.documentElement
    })
  };
  c.fn.scrollTo = function (f, e, d) {
    if (typeof e == "object") {
      d = e;
      e = 0
    }
    if (typeof d == "function") {
      d = {onAfter: d}
    }
    if (f == "max") {
      f = 9000000000
    }
    d = c.extend({}, a.defaults, d);
    e = e || d.duration;
    d.queue = d.queue && d.axis.length > 1;
    if (d.queue) {
      e /= 2
    }
    d.offset = b(d.offset);
    d.over = b(d.over);
    return this._scrollable().each(function () {
      if (f == null) {
        return
      }
      var l = this, j = c(l), k = f, i, g = {}, m = j.is("html,body");
      switch (typeof k) {
        case"number":
        case"string":
          if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(k)) {
            k = b(k);
            break
          }
          k = c(k, this);
          if (!k.length) {
            return
          }
        case"object":
          if (k.is || k.style) {
            i = (k = c(k)).offset()
          }
      }
      c.each(d.axis.split(""), function (q, r) {
        var s = r == "x" ? "Left" : "Top", u = s.toLowerCase(), p = "scroll" + s, o = l[p], n = a.max(l, r);
        if (i) {
          g[p] = i[u] + (m ? 0 : o - j.offset()[u]);
          if (d.margin) {
            g[p] -= parseInt(k.css("margin" + s)) || 0;
            g[p] -= parseInt(k.css("border" + s + "Width")) || 0
          }
          g[p] += d.offset[u] || 0;
          if (d.over[u]) {
            g[p] += k[r == "x" ? "width" : "height"]() * d.over[u]
          }
        }
        else{
          var t = k[u];
          g[p] = t.slice && t.slice(-1) == "%" ? parseFloat(t) / 100 * n : t
        }
        if (d.limit && /^\d+$/.test(g[p])) {
          g[p] = g[p] <= 0 ? 0 : Math.min(g[p], n)
        }
        if (!q && d.queue) {
          if (o != g[p]) {
            h(d.onAfterFirst)
          }
          delete g[p]
        }
      });
      h(d.onAfter);
      function h(n) {
        j.animate(g, e, d.easing, n && function () {
          n.call(this, f, d)
        })
      }
    }).end()
  };
  a.max = function (j, i) {
    var h = i == "x" ? "Width" : "Height", e = "scroll" + h;
    if (!c(j).is("html,body")) {
      return j[e] - c(j)[h.toLowerCase()]()
    }
    var g = "client" + h, f = j.ownerDocument.documentElement, d = j.ownerDocument.body;
    return Math.max(f[e], d[e]) - Math.min(f[g], d[g])
  };
  function b(d) {
    return typeof d == "object" ? d : {top: d, left: d}
  }
})(jQuery);
(function (a) {
  a.lsTest = function () {
    var c = "test";
    try {
      localStorage.setItem(c, c);
      localStorage.removeItem(c);
      return true
    } catch (b) {
      return false
    }
  };
  a.localStorage = {set: function () {
    if (window.localStorage) {
      for (var b in arguments) {
        localStorage.setItem(arguments[b].item, arguments[b].value)
      }
    }
  }, read: function () {
    if (window.localStorage) {
      var b = [];
      for (var c in arguments) {
        b.push(localStorage.getItem(arguments[c]))
      }
      return b
    }
  }, remove: function () {
    if (window.localStorage) {
      if (arguments[0] === undefined) {
        for (b in localStorage) {
          localStorage.removeItem(b)
        }
      }
      else{
        for (var b in arguments) {
          localStorage.removeItem(arguments[b])
        }
      }
    }
  }}
})(jQuery);
(function (D, j, o) {
  var c = {8: "backspace", 9: "tab", 13: "enter", 16: "shift", 17: "ctrl", 18: "alt", 20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home", 37: "left", 38: "up", 39: "right", 40: "down", 45: "ins", 46: "del", 91: "meta", 93: "meta", 224: "meta"}, G = {106: "*", 107: "+", 109: "-", 110: ".", 111: "/", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'"}, f = {"~": "`", "!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0", _: "-", "+": "=", ":": ";", '"': "'", "<": ",", ">": ".", "?": "/", "|": "\\"}, k = {option: "alt", command: "meta", "return": "enter", escape: "esc", mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"}, x, I = {}, B = {}, t = {}, y, m = false, p = false, s = false;
  for (var H = 1; H < 20; ++H) {
    c[111 + H] = "f" + H
  }
  for (H = 0; H <= 9; ++H) {
    c[H + 96] = H
  }
  function z(i, M, N) {
    if (i.addEventListener) {
      i.addEventListener(M, N, false);
      return
    }
    i.attachEvent("on" + M, N)
  }

  function w(M) {
    if (M.type == "keypress") {
      var i = String.fromCharCode(M.which);
      if (!M.shiftKey) {
        i = i.toLowerCase()
      }
      return i
    }
    if (c[M.which]) {
      return c[M.which]
    }
    if (G[M.which]) {
      return G[M.which]
    }
    return String.fromCharCode(M.which).toLowerCase()
  }

  function v(M, i) {
    return M.sort().join(",") === i.sort().join(",")
  }

  function d(i) {
    i = i || {};
    var N = false, M;
    for (M in t) {
      if (i[M]) {
        N = true;
        continue
      }
      t[M] = 0
    }
    if (!N) {
      s = false
    }
  }

  function J(R, V, S, X, T, M) {
    var P, W, Q = [], N = S.type;
    if (!I[R]) {
      return[]
    }
    if (N == "keyup" && a(R)) {
      V = [R]
    }
    for (P = 0; P < I[R].length; ++P) {
      W = I[R][P];
      if (!X && W.seq && t[W.seq] != W.level) {
        continue
      }
      if (N != W.action) {
        continue
      }
      if ((N == "keypress" && !S.metaKey && !S.ctrlKey) || v(V, W.modifiers)) {
        var U = !X && W.combo == T;
        var O = X && W.seq == X && W.level == M;
        if (U || O) {
          I[R].splice(P, 1)
        }
        Q.push(W)
      }
    }
    return Q
  }

  function e(M) {
    var i = [];
    if (M.shiftKey) {
      i.push("shift")
    }
    if (M.altKey) {
      i.push("alt")
    }
    if (M.ctrlKey) {
      i.push("ctrl")
    }
    if (M.metaKey) {
      i.push("meta")
    }
    return i
  }

  function C(i) {
    if (i.preventDefault) {
      i.preventDefault();
      return
    }
    i.returnValue = false
  }

  function L(i) {
    if (i.stopPropagation) {
      i.stopPropagation();
      return
    }
    i.cancelBubble = true
  }

  function q(O, M, i, N) {
    if (g.stopCallback(M, M.target || M.srcElement, i, N)) {
      return
    }
    if (O(M, i) === false) {
      C(M);
      L(M)
    }
  }

  function u(Q, T, R) {
    var S = J(Q, T, R), O, N = {}, U = 0, P = false;
    for (O = 0; O < S.length; ++O) {
      if (S[O].seq) {
        U = Math.max(U, S[O].level)
      }
    }
    for (O = 0; O < S.length; ++O) {
      if (S[O].seq) {
        if (S[O].level != U) {
          continue
        }
        P = true;
        N[S[O].seq] = 1;
        q(S[O].callback, R, S[O].combo, S[O].seq);
        continue
      }
      if (!P) {
        q(S[O].callback, R, S[O].combo)
      }
    }
    var M = R.type == "keypress" && p;
    if (R.type == s && !a(Q) && !M) {
      d(N)
    }
    p = P && R.type == "keydown"
  }

  function A(M) {
    if (typeof M.which !== "number") {
      M.which = M.keyCode
    }
    var i = w(M);
    if (!i) {
      return
    }
    if (M.type == "keyup" && m === i) {
      m = false;
      return
    }
    g.handleKey(i, e(M), M)
  }

  function a(i) {
    return i == "shift" || i == "ctrl" || i == "alt" || i == "meta"
  }

  function F() {
    clearTimeout(y);
    y = setTimeout(d, 1000)
  }

  function n() {
    if (!x) {
      x = {};
      for (var i in c) {
        if (i > 95 && i < 112) {
          continue
        }
        if (c.hasOwnProperty(i)) {
          x[c[i]] = i
        }
      }
    }
    return x
  }

  function b(M, i, N) {
    if (!N) {
      N = n()[M] ? "keydown" : "keypress"
    }
    if (N == "keypress" && i.length) {
      N = "keydown"
    }
    return N
  }

  function h(O, T, R, P) {
    t[O] = 0;
    function S(i) {
      return function () {
        s = i;
        ++t[O];
        F()
      }
    }

    function U(i) {
      q(R, i, O);
      if (P !== "keyup") {
        m = w(i)
      }
      setTimeout(d, 10)
    }

    for (var Q = 0; Q < T.length; ++Q) {
      var N = Q + 1 === T.length;
      var M = N ? U : S(P || K(T[Q + 1]).action);
      r(T[Q], M, P, O, Q)
    }
  }

  function l(i) {
    if (i === "+") {
      return["+"]
    }
    return i.split("+")
  }

  function K(P, R) {
    var Q, O, N, M = [];
    Q = l(P);
    for (N = 0; N < Q.length; ++N) {
      O = Q[N];
      if (k[O]) {
        O = k[O]
      }
      if (R && R != "keypress" && f[O]) {
        O = f[O];
        M.push("shift")
      }
      if (a(O)) {
        M.push(O)
      }
    }
    R = b(O, M, R);
    return{key: O, modifiers: M, action: R}
  }

  function r(i, R, M, O, Q) {
    B[i + ":" + M] = R;
    i = i.replace(/\s+/g, " ");
    var P = i.split(" "), N;
    if (P.length > 1) {
      h(i, P, R, M);
      return
    }
    N = K(i, M);
    I[N.key] = I[N.key] || [];
    J(N.key, N.modifiers, {type: N.action}, O, i, Q);
    I[N.key][O ? "unshift" : "push"]({callback: R, modifiers: N.modifiers, action: N.action, seq: O, level: Q, combo: i})
  }

  function E(N, P, O) {
    for (var M = 0; M < N.length; ++M) {
      r(N[M], P, O)
    }
  }

  z(j, "keypress", A);
  z(j, "keydown", A);
  z(j, "keyup", A);
  var g = {bind: function (i, N, M) {
    i = i instanceof Array ? i : [i];
    E(i, N, M);
    return this
  }, unbind: function (i, M) {
    return g.bind(i, function () {
    }, M)
  }, trigger: function (i, M) {
    if (B[i + ":" + M]) {
      B[i + ":" + M]({}, i)
    }
    return this
  }, reset: function () {
    I = {};
    B = {};
    return this
  }, stopCallback: function (M, i) {
    if ((" " + i.className + " ").indexOf(" mousetrap ") > -1) {
      return false
    }
    return i.tagName == "INPUT" || i.tagName == "SELECT" || i.tagName == "TEXTAREA" || i.isContentEditable
  }, handleKey: u};
  D.Mousetrap = g;
  if (typeof define === "function" && define.amd) {
    define(g)
  }
})(window, document);