## koa-ip

> koa-ip is a ip filter middleware for koa, support `whitelist` and `blacklist`.

**NB:** koa-ip@0.1.0 for koa@1

### Install

```sh
$ npm i koa-ip --save
```

### Usage

```js
ip(String|RegExp)
ip(Array{String|RegExp})
ip({
  whitelist: Array{String|RegExp},
  blacklist: Array{String|RegExp},
  handler: async (ctx) => {}// handle black ip
})
```

### Examples

```js
const Koa = require('koa')
const ip = require('koa-ip')

const app = new Koa()

app.use(ip('192.168.0.*'))// whitelist
// app.use(ip(['192.168.0.*', '8.8.8.[0-3]']))// whitelist
// app.use(ip({
//   whitelist: ['192.168.0.*', '8.8.8.[0-3]'],// whitelist
//   blacklist: ['144.144.*']// blacklist
// }))

app.listen(3000)
```

#### blacklist handler

```js
const app = new Koa()
app.use((ctx, next) => {
  ctx.request.ip = '127.0.0.1'
  return next()
})
app.use(ip({
  blacklist: ['127.0.0.*'],
  handler: async (ctx) => {
    ctx.status = 403
  }
}))

app.use((ctx, next) => {
  ctx.status = 200
})

app.listen(3000)
```

More examples see [test](./test.js).

### Test

```sh
$ npm test
```

### License

MIT