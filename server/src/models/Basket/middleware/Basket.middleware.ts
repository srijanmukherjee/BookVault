import { MiddlewareInterface, NextFn, ResolverData } from "type-graphql";
import { Service } from "typedi";
import { v4 as uuidv4 } from 'uuid';
import { client } from "../../../db";
import { Context } from "../../../graphql/context";
import { getAuthorizedUser } from "../../../auth/AuthChecker";
import Basket from "../Basket.model";
import Account from "../../Account/Account.model";

export const BASKET_COOKIE = 'basketId'

const basketInclude = {
    basketItems: {
        include: {
            product: {
                include: {
                    book: true
                }
            },
        },
    },
    user: true
}

async function createBasket(basketId: string, owner: Account | null): Promise<Basket> {

    const update: any = {};

    if (owner) {
        update.user = {
            connect: {
                email: owner.email
            },
        }
    }

    const basket: Basket = await client.basket.upsert({
        where: {
            id: basketId,
        },
        update,
        create: {
            id: basketId,
            ...(owner && { user: { connect: { email: owner.email } } })
        },
        include: basketInclude
    });

    // TODO: better way to do this without extra  db call
    // update owner basket id
    if (owner) {
        await client.user.update({
            where: {
                id: owner.id,
            },
            data: {
                basketId: basket.id
            }
        })
    }

    return basket;
}

async function fetchBasket(basketId: string): Promise<Basket | null> {
    return await client.basket.findUnique({
        where: {
            id: basketId
        },
        include: basketInclude
    })
}

function setBasketCookie(context: Context, basketId: string) {
    const maxAge = new Date().getTime() + 60 * 60 * 24 * 30 * 1000;
    context.res.cookie(BASKET_COOKIE, basketId, { maxAge });
}

async function createBasketAndSetCookie(context: any) {
    let basketId;
    let user = null;

    if (context.user) {
        user = await getAuthorizedUser(context.user);

        if (user?.basketId) {
            console.debug("User basket: " + user.basketId)
            setBasketCookie(context, user.basketId);
            context.basket = await fetchBasket(user.basketId);
        }

        if (!context.basket)
            console.debug("User doesn't have a basket attached to account");
    }

    // user was quthenticated and alreadty had a linked basket
    if (context.basket) return;

    // unauthenticated user or authenticated user with no basket
    basketId = uuidv4();
    const basket = await createBasket(basketId, user);
    context.basket = basket;
    setBasketCookie(context, basketId);
}

@Service()
export class BasketInterceptor implements MiddlewareInterface<Context> {
    constructor() { }

    async use({ context }: ResolverData<Context>, next: NextFn) {
        // create basket if it already doesn't exist
        if (!context.req.cookies[BASKET_COOKIE]) {
            await createBasketAndSetCookie(context);
        } else {
            console.debug("request basket id: " + context.req.cookies[BASKET_COOKIE]);

            const basketId = context.req.cookies[BASKET_COOKIE];
            context.basket = await fetchBasket(basketId);

            // basket not found or basket user doesn't match
            if (context.basket === null || (context.user && context.basket.userEmail !== context.user.email)) {
                await createBasketAndSetCookie(context);
            }
        }

        return next();
    }
}

// updates basket's lastUpdate time whenever any changes have been made to the basket
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