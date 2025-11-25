import { Middleware, Context, Next } from 'koa';

declare namespace koaIP {
    type IPPatternsType = string | RegExp

    interface koaIPOptionsObject {
        whitelist?: Array<IPPatternsType>,
        blacklist?: Array<IPPatternsType>,
        handler?: (ctx: Context, next: Next) => void | Promise<void>
    }

    type KoaIPOptions = koaIPOptionsObject | Array<IPPatternsType> | IPPatternsType

    interface koaIP {
        (options: KoaIPOptions): Middleware;
    }
}

declare const koaIP: koaIP.koaIP;
export = koaIP;