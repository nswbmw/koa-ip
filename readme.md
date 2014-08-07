## koa-ip

koa-ip is a ip filter middleware for koa, support whitelist and blacklist.

### Install

    npm i koa-ip --save

### Usage

```
var koa = require('koa');
var ip = require('koa-ip');

var app = koa();

app.use(ip('192.168.0.*'));
// or
// app.use(ip(['192.168.0.*', '8.8.8.[0-3]']));
// or
// app.use(ip({
//   whiteList: ['192.168.0.*', '8.8.8.[0-3]'],
//   blackList: ['144.144.*']
// }));
app.use(...);

app.listen(3000);
```

### License

MIT