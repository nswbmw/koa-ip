const assert = require('assert')
const isPlainObject = require('lodash.isplainobject')
const debug = require('debug')('koa-ip')

module.exports = function (opts) {
  assert(opts, 'koa-ip missing opts')
  if (!isPlainObject(opts)) {
    opts = { whitelist: Array.isArray(opts) ? opts : [opts] }
  }

  return async function koaIp (ctx, next) {
    const ip = ctx.ip
    let pass = false
    if (opts.whitelist && Array.isArray(opts.whitelist)) {
      pass = opts.whitelist.some((item) => {
        return new RegExp(item).test(ip)
      })
    }

    if (pass && opts.blacklist && Array.isArray(opts.blacklist)) {
      pass = !opts.blacklist.some((item) => {
        return new RegExp(item).test(ip)
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
