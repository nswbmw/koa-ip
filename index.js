const assert = require('assert')
const isPlainObject = require('lodash.isplainobject')
const requestIp = require('request-ip')
const debug = require('debug')('koa-ip')

module.exports = function (opts) {
  assert(opts, 'koa-ip missing opts')
  if (!isPlainObject(opts)) {
    opts = { whitelist: Array.isArray(opts) ? opts : [opts] }
  }

  return async function koaIp (ctx, next) {
    const ip = ctx.ip || requestIp.getClientIp(ctx.req)
    let pass = true

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

    // pass
    if (pass) {
      debug(`${new Date()}: "${ip} -> ✓"`)
      return next()
    }

    // not pass
    if (typeof opts.handler === 'function') {
      debug(`${new Date()}: "${ip} -> handler"`)
      await opts.handler(ctx, next)
    } else {
      debug(`${new Date()}: "${ip} -> ×"`)
      ctx.throw(403)
    }
  }
}
