import { Request, Response } from "express";
import { IncomingMessage } from "http";
import { MiddlewareFn, MiddlewareInterface, NextFn, ResolverData, UseMiddleware } from "type-graphql";
import { ContextParamMetadata } from "type-graphql/dist/metadata/definitions";
import { Service } from "typedi";
import { v4 as uuidv4 } from 'uuid';
import { client } from "../../db";

export interface Context extends IncomingMessage {
    res: Response,
    req: Request
}

export const BASKET_COOKIE = 'basketId'

@Service()
export class BasketInterceptor implements MiddlewareInterface<Context> {
    constructor() { }

    async use({ context, info, args, root }: ResolverData<Context>, next: NextFn) {
        if (!context.req.cookies[BASKET_COOKIE]) {
            console.log('basketId not in cookie: create basket');
            const basketId = uuidv4();
            console.log(`new basket id: ${basketId}`);

            const basket = await client.basket.create({
                data: {
                    id: basketId
                }
            });

            const maxAge = new Date().getTime() + 60 * 60 * 24 * 30 * 1000;
            context.res.cookie(BASKET_COOKIE, basketId, { maxAge });
        }

        return next();
    }
}