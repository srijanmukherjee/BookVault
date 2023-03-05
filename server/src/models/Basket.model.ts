import 'reflect-metadata';
import { ObjectType, Field, Resolver, Query, ID, Args, ArgsType, Arg, Ctx, UseMiddleware, Mutation } from 'type-graphql';
import { client } from '../db';
import { BasketItem } from './BasketItem.model';
import { BASKET_COOKIE, BasketInterceptor, Context } from './middleware/BasketMiddleware';
import { Prisma } from '@prisma/client';

@ObjectType("Basket")
export class Basket {
    @Field(type => ID)
    id: string

    @Field(type => [BasketItem])
    basketItems: BasketItem[]

    @Field(type => Date)
    lastUpdate: Date
}

@Resolver(Basket)
export class BasketResolver {
    @Query((returns) => Basket, { nullable: true })
    @UseMiddleware(BasketInterceptor)
    async basket(@Ctx() context: Context) {
        const basketId = context.req.cookies[BASKET_COOKIE];
        return client.basket.findFirst({
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

    @Mutation(type => BasketItem, { nullable: true })
    @UseMiddleware(BasketInterceptor)
    async addBasketItem(@Arg("productId") productId: number, @Arg("quantity", { defaultValue: 1 }) quantity: number, @Ctx() context: Context) {
        const basketId = context.req.cookies[BASKET_COOKIE];
        const basketItem = await client.basketItem.findFirst({
            where: {
                basketId, productId
            }
        });

        if (!basketItem) {

            if (quantity < 0) return null;

            return await client.basketItem.create({
                data: {
                    product: {
                        connect: {
                            id: productId
                        }
                    },
                    basket: {
                        connect: {
                            id: basketId
                        }
                    },
                    quantity
                },
                include: {
                    product: {
                        include: {
                            book: true
                        }
                    }
                }
            });

        }

        else {
            const newQuantity = basketItem.quantity + quantity;

            if (newQuantity <= 0) {
                return await client.basketItem.delete({
                    where: {
                        id: basketItem.id
                    }
                });
            }

            return await client.basketItem.update({
                data: {
                    quantity: {
                        set: newQuantity
                    }
                },
                where: {
                    id: basketItem.id
                }
            });
        }
    }

    @Mutation(type => Basket)
    @UseMiddleware(BasketInterceptor)
    async removeBasketItem(@Arg("productId") productId: number, @Ctx() context: Context) {
        const basketId = context.req.cookies[BASKET_COOKIE];
        try {

            const [removedItem, basket] = await client.$transaction([
                client.basketItem.delete({
                    where: {
                        basketId_productId: {
                            basketId, productId
                        },
                    }
                }),
                client.basket.findFirst({
                    where: {
                        id: basketId,
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
            ]);
            return basket
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw { error: "Basket item not found" }
            }
        }
    }
}