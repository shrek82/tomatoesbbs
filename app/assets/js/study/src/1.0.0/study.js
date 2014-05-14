define(function (require, exports, module) {


  //极简类创建方法
  var Study = {
    version: '1.0.0',
    createNew: function () {
      var study = {};
      study.version = function () {
        console.log('version:' + Study.version);
      };
      study.hello = function () {
        console.log('hello world!');
      };

      return study;
    }
  };

  //hasOwnProperty：是用来判断一个对象是否有你给出名称的属性或对象。不过需要注意的是，此方法无法检查该对象的原型链中是否具有该属性，该属性必须是对象本身的一个成员。
  //isPrototypeOf是用来判断要检查其原型链的对象是否存在于指定对象实例中，是则返回true，否则返回false。
  Study.hasMethod = function(){
    function siteAdmin(nickName, siteName) {
      this.nickName = nickName;
      this.siteName = siteName;
    }

    siteAdmin.prototype.showAdmin = function () {
      alert(this.nickName + "是" + this.siteName + "的站长!")
    };

    siteAdmin.prototype.showSite = function (siteUrl) {
      this.siteUrl = siteUrl;
      return this.siteName + "的地址是" + this.siteUrl;
    };

    var matou = new siteAdmin("愚人码头", "WEB前端开发");
    var matou2 = new siteAdmin("愚人码头", "WEB前端开发");
    matou.age = "30";

    console.log(matou.hasOwnProperty("nickName"));//true
    console.log(matou.hasOwnProperty("age"));//true
    console.log(matou.hasOwnProperty("showAdmin"));//false
    console.log(matou.hasOwnProperty("siteUrl"));//false
    console.log('siteAdmin.prototype.hasOwnProperty("showAdmin")'+siteAdmin.prototype.hasOwnProperty("showAdmin"));//true
    console.log('siteAdmin.prototype.hasOwnProperty("siteUrl")'+siteAdmin.prototype.hasOwnProperty("siteUrl"));//false
    console.log('siteAdmin.prototype.isPrototypeOf(matou)'+siteAdmin.prototype.isPrototypeOf(matou))//true
    console.log('siteAdmin.prototype.isPrototypeOf(matou):'+siteAdmin.prototype.isPrototypeOf(matou2))//true
  }

  module.exports = Study;

});