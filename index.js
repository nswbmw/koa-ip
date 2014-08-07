var debug = require('debug')('koa-ip');

module.exports = ip;

function ip(conf) {
  if (typeof conf !== 'object') {
    if (typeof conf === 'string') {
      conf = {whiteList: [conf]};
    } else {
      conf = {};
    }
  }
  if (Array.isArray(conf)) {
    conf = {whiteList: conf};
  }
  return function* (next) {
    var _ip = this.ip;
    var pass = false;
    if (conf.whiteList && Array.isArray(conf.whiteList)) {
      pass = conf.whiteList.some(function (item) {
        return RegExp(item).test(_ip);
      });
    }

    if (conf.blackList && Array.isArray(conf.blackList)) {
      pass = !conf.blackList.some(function (item) {
        return RegExp(item).test(_ip);
      });
    }

    if (pass) {
      debug((new Date).toUTCString() + ' ' + _ip + ' -> ✓');
      yield next;
    } else {
      debug((new Date).toUTCString() + ' ' + _ip + ' -> ×');
    }
  }
}