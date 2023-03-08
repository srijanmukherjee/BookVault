import 'reflect-metadata';
import { ObjectType, Field, Resolver, Query, ID, Arg, Ctx, UseMiddleware, Mutation } from 'type-graphql';
import { client } from '../db';
import { BasketItem } from './BasketItem.model';
import { BasketInterceptor, BasketLastUpdate, Context } from './middleware/BasketMiddleware';
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
        const basketId = context.basket!.id;
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

    @Mutation(type => Basket, { nullable: true })
    @UseMiddleware(BasketInterceptor)
    @UseMiddleware(BasketLastUpdate)
    async addBasketItem(@Arg("productId") productId: number, @Arg("quantity", { defaultValue: 1 }) quantity: number, @Ctx() context: Context) {
        const basketId = context.basket!.id;
        const basketItem = context.basket!.basketItems.find((item) => item.productId === productId);
        const product = await client.product.findFirst({
            where: {
                id: productId
            }
        });

        if (product == null) throw new Error("Product not found");

        if (!basketItem) {

            if (quantity <= 0) throw new Error("quantity must be positive");

            const item = await client.basketItem.create({
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

            context.basket!.basketItems = [...context.basket!.basketItems, item];
            return context.basket!;
        }

        else {
            const newQuantity = basketItem.quantity + quantity;

            if (newQuantity <= 0) {
                await client.basketItem.delete({
                    where: {
                        id: basketItem.id
                    }
                });

                context.basket!.basketItems = context.basket!.basketItems.filter((item) => item.id != basketItem.id);
                return context.basket!;
            }

            await client.basketItem.update({
                data: {
                    quantity: {
                        set: newQuantity
                    }
                },
                where: {
                    id: basketItem.id
                },
                include: {
                    product: {
                        include: {
                            book: true
                        }
                    }
                }
            });

            const idx = context.basket!.basketItems.findIndex((item) => item.id === basketItem.id);
            if (idx >= 0) {
                context.basket!.basketItems[idx].quantity = newQuantity;
            }

            return context.basket!;
        }
    }

    @Mutation(type => Basket)
    @UseMiddleware(BasketInterceptor)
    @UseMiddleware(BasketLastUpdate)
    async removeBasketItem(@Arg("productId") productId: number, @Ctx() context: Context) {
        const basketId = context.basket!.id;
        try {
            await client.basketItem.delete({
                where: {
                    basketId_productId: {
                        basketId, productId
                    },
                }
            })

            context.basket!.basketItems = context.basket!.basketItems.filter((item) => item.productId != productId);
            return context.basket!;
        } catch (e: any) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error("Basket item not found")
            }

            console.trace(e);
            throw new Error("Something went wrong, check logs");
        }
    }
}