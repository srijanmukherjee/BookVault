import { Request, Response } from "express";
import { IncomingMessage } from "http";
import { MiddlewareInterface, NextFn, ResolverData } from "type-graphql";
import { Service } from "typedi";
import { v4 as uuidv4 } from 'uuid';
import { client } from "../../db";
import { Basket } from "../Basket.model";

export interface Context extends IncomingMessage {
    res: Response,
    req: Request,
    basket: Basket | null
}

export const BASKET_COOKIE = 'basketId'

async function createBasket(): Promise<[string, Basket]> {
    const basketId = uuidv4();
    console.log(`new basket id: ${basketId}`);

    const basket: Basket = await client.basket.create({
        data: {
            id: basketId
        },
        include: {
            basketItems: {
                include: {
                    product: {
                        include: {
                            book: true
                        }
                    },
                },
            }
        }
    });

    return [basketId, basket];
}

async function fetchBasket(basketId: string): Promise<Basket | null> {
    return await client.basket.findFirst({
        where: {
            id: basketId
        },
        include: {
            basketItems: {
                include: {
                    product: {
                        include: {
                            book: true
                        }
                    }
                }
            }
        }
    })
}

async function createBasketAndSetCookie(context: any) {
    const [basketId, basket] = await createBasket();
    const maxAge = new Date().getTime() + 60 * 60 * 24 * 30 * 1000;
    context.basket = basket;
    context.res.cookie(BASKET_COOKIE, basketId, { maxAge });
}

@Service()
export class BasketInterceptor implements MiddlewareInterface<Context> {
    constructor() { }

    async use({ context, info, args, root }: ResolverData<Context>, next: NextFn) {
        // create basket if it already doesn't exist
        if (!context.req.cookies[BASKET_COOKIE]) {
            await createBasketAndSetCookie(context);
        } else {
            const basketId = context.req.cookies[BASKET_COOKIE];
            context.basket = await fetchBasket(basketId);

            if (context.basket === null) {
                await createBasketAndSetCookie(context);
            }
        }

        return next();
    }
}

@Service()
export class BasketLastUpdate implements MiddlewareInterface<Context> {
    constructor() { }

    async use({ context }: ResolverData<Context>, next: NextFn) {
        const result = await next();

        try {
            await client.basket.update({
                where: {
                    id: context.basket!.id
                },
                data: {
                    lastUpdate: new Date()
                }
            })
        } catch (e) {
            console.log("🟥 failed to update lastUpdate time of the basket ", context.basket?.id);
            console.log("Reason: ");
            console.error(e);
        }

        return result;
    }
}