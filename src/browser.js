'use strict'
/* eslint-disable no-var */

// Inspired by
// <http://pingturtle.com/home/post/cloudflare-email-protection-decoder>.
;(function () {
  var decode = function (str) {
    var result = ''
    var key = parseInt(str.substr(0, 2), 16)
    for (var i = 2; i < str.length; i += 2) {
      var charCode = parseInt(str.substr(i, 2), 16) ^ key
      result += String.fromCharCode(charCode)
    }
    return result
  }

  var anchors = document.querySelectorAll('a[data-email]')
  for (var i = 0, l = anchors.length; i < l; i++) {
    var elem = anchors[i]
    elem.href = 'mailto:' + decode(elem.getAttribute('data-email'))
  }
})()
