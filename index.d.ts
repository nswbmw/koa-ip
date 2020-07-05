import { Middleware, Context, Next } from 'koa';

declare namespace koaIP {
    type IPPatternsType = String | RegExp

    interface koaIPOptionsObject {
        whitelist?: Array<IPPatternsType>,
        blacklist?: Array<IPPatternsType>,
        handler?: (ctx: Context, next: Next) => any
    }

    type KoaIPOptions = koaIPOptionsObject | Array<IPPatternsType> | IPPatternsType

    interface koaIP {
        (options: KoaIPOptions): Middleware;
    }
}

declare const koaIP: koaIP.koaIP;
export = koaIP;