const request = require('supertest')
const Koa = require('koa')
const ip = require('..')

describe('koa-ip', () => {
  it('paramters error', async () => {
    const app = new Koa()
    let error
    try {
      app.use(ip())
    } catch (e) {
      error = e
    }
    expect(error.message).toBe('koa-ip missing opts')
  })

  it('string success', async () => {
    const app = new Koa()
    app.use((ctx, next) => {
      ctx.request.ip = '192.168.0.1'
      return next()
    })
    app.use(ip('192.168.0.*'))
    app.use((ctx, next) => {
      ctx.status = 200
    })

    await request(app.callback()).get('/').expect(200)
  })

  it('string failed', async () => {
    const app = new Koa()
    app.use((ctx, next) => {
      ctx.request.ip = '192.168.1.1'
      return next()
    })
    app.use(ip(/^192.168.0.*$/))
    app.use((ctx, next) => {
      ctx.status = 200
    })

    await request(app.callback()).get('/').expect(403)
  })

  it('array success', async () => {
    const app = new Koa()
    app.use((ctx, next) => {
      ctx.request.ip = '192.168.1.1'
      return next()
    })
    app.use(ip([/^192.168.0.*$/, '192.168.1.*']))
    app.use((ctx, next) => {
      ctx.status = 200
    })

    await request(app.callback()).get('/').expect(200)
  })

  it('array failed', async () => {
    const app = new Koa()
    app.use((ctx, next) => {
      ctx.request.ip = '192.168.1.1'
      return next()
    })
    app.use(ip(['192.168.0.*']))
    app.use((ctx, next) => {
      ctx.status = 200
    })

    await request(app.callback()).get('/').expect(403)
  })

  it('object success', async () => {
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

    await request(app.callback()).get('/').expect(200)
  })

  it('object failed', async () => {
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

    await request(app.callback()).get('/').expect(403)
  })

  it('blacklist handler', async () => {
    const app = new Koa()
    app.use((ctx, next) => {
      ctx.request.ip = '192.168.0.1'
      return next()
    })
    app.use(ip({
      blacklist: ['192.168.0.[1-9]'],
      handler: async (ctx) => {
        ctx.status = 403
        ctx.body = 'Forbidden!!!'
      }
    }))
    app.use((ctx, next) => {
      ctx.status = 200
    })

    const res = await request(app.callback()).get('/')
    expect(res.status).toBe(403)
    expect(res.text).toBe('Forbidden!!!')
  })

  it('blacklist handler passthrough', async () => {
    const app = new Koa()
    app.use((ctx, next) => {
      ctx.request.ip = '192.168.0.1'
      return next()
    })
    app.use(ip({
      blacklist: ['192.168.0.[1-9]'],
      handler: async (ctx, next) => {
        return next()
      }
    }))
    app.use((ctx, next) => {
      ctx.status = 401
      ctx.body = 'Please login!!!'
    })

    const res = await request(app.callback()).get('/')
    expect(res.status).toBe(401)
    expect(res.text).toBe('Please login!!!')
  })

  it('use request-ip', async () => {
    const app = new Koa()
    app.use((ctx, next) => {
      // rewrite scoket.remoteAddress
      Object.defineProperty(ctx.req.socket, 'remoteAddress', {
        value: null
      })
      ctx.req.headers['x-forwarded-for'] = '1.1.1.1'
      return next()
    })
    app.use(ip(/^1.1.1.*$/))
    app.use((ctx, next) => {
      ctx.status = 200
    })

    await request(app.callback()).get('/').expect(200)
  })
})
