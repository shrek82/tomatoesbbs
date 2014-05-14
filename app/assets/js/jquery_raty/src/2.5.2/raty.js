define(function (require, exports, module) {

  var lib = require('lib');
  require('./slides_raty')($);

  module.exports = function (fun) {
    if (fun) {
      fun();
    }
  }

});