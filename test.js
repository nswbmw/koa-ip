const request = require('supertest')
const Koa = require('koa')
const ip = require('./')

describe('koa-ip', () => {
  it('paramters error', (done) => {
    const app = new Koa()

    try {
      app.use(ip())
    } catch (e) {
      if (e.message === 'koa-ip missing opts') {
        done()
      } else {
        done(e)
      }
    }
  })

  it('string success', (done) => {
    const app = new Koa()
    app.use((ctx, next) => {
      ctx.request.ip = '192.168.0.1'
      return next()
    })
    app.use(ip('192.168.0.*'))
    app.use((ctx, next) => {
      ctx.status = 200
    })

    request(app.callback())
      .get('/')
      .expect(200)
      .end(done())
  })

  it('string failed', (done) => {
    const app = new Koa()
    app.use((ctx, next) => {
      ctx.request.ip = '192.168.1.1'
      return next()
    })
    app.use(ip(/^192.168.0.*$/))
    app.use((ctx, next) => {
      ctx.status = 200
    })

    request(app.callback())
      .get('/')
      .expect(404)
      .end(done())
  })

  it('array success', (done) => {
    const app = new Koa()
    app.use((ctx, next) => {
      ctx.request.ip = '192.168.1.1'
      return next()
    })
    app.use(ip([/^192.168.0.*$/, '192.168.1.*']))
    app.use((ctx, next) => {
      ctx.status = 200
    })

    request(app.callback())
      .get('/')
      .expect(200)
      .end(done())
  })

  it('array failed', (done) => {
    const app = new Koa()
    app.use((ctx, next) => {
      ctx.request.ip = '192.168.1.1'
      return next()
    })
    app.use(ip(['192.168.0.*']))
    app.use((ctx, next) => {
      ctx.status = 200
    })

    request(app.callback())
      .get('/')
      .expect(404)
      .end(done())
  })

  it('object success', (done) => {
    const app = new Koa()
    app.use((ctx, next) => {
      ctx.request.ip = '192.168.0.1'
      return next()
    })
    app.use(ip({
      blacklist: ['192.168.0.[2-9]']
    }))
    app.use((ctx, next) => {
      ctx.status = 200
    })

    request(app.callback())
      .get('/')
      .expect(200)
      .end(done())
  })

  it('object failed', (done) => {
    const app = new Koa()
    app.use((ctx, next) => {
      ctx.request.ip = '192.168.0.1'
      return next()
    })
    app.use(ip({
      whitelist: ['192.168.0.1'],
      blacklist: ['192.168.0.[1-9]']
    }))
    app.use((ctx, next) => {
      ctx.status = 200
    })

    request(app.callback())
      .get('/')
      .expect(404)
      .end(done())
  })

  it('handler', (done) => {
    const app = new Koa()
    app.use((ctx, next) => {
      ctx.request.ip = '192.168.0.1'
      return next()
    })
    app.use(ip({
      blacklist: ['192.168.0.[1-9]'],
      handler: async (ctx) => {
        ctx.status = 403
      }
    }))
    app.use((ctx, next) => {
      ctx.status = 200
    })

    request(app.callback())
      .get('/')
      .expect(403)
      .end(done())
  })
})
