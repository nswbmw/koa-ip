const assert = require('assert')
const _ = require('lodash')
const debug = require('debug')('koa-ip')

module.exports = function (opts) {
  assert(opts, 'koa-ip missing opts')
  if (!_.isPlainObject(opts)) {
    opts = { whitelist: _.isArray(opts) ? opts : [opts] }
  }

  return async function koaIp (ctx, next) {
    const ip = ctx.ip
    let pass = false
    if (opts.whitelist && _.isArray(opts.whitelist)) {
      pass = opts.whitelist.some((item) => {
        return RegExp(item).test(ip)
      })
    }

    if (pass && opts.blacklist && _.isArray(opts.blacklist)) {
      pass = !opts.blacklist.some((item) => {
        return RegExp(item).test(ip)
      })
    }

    if (pass) {
      debug(`${new Date()}: "${ip} -> ✓"`)
      return next()
    } else {
      if (typeof opts.handler === 'function') {
        debug(`${new Date()}: "${ip} -> handler"`)
        await Promise.resolve(opts.handler(ctx))
      } else {
        debug(`${new Date()}: "${ip} -> ×"`)
      }
    }
  }
}
