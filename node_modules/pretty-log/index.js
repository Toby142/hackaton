require('colors');

exports.error = function (msg) {
  console.log('[ERROR] => '.red + msg)
}

exports.warn = function (msg) {
  console.log('[WARN] => '.blue + msg)
}

exports.success = function (msg) {
  console.log('[SUCCESS] => '.green + msg)
}

exports.debug = function (msg) {
  console.log('[DEBUG] => '.yellow + msg)
}

