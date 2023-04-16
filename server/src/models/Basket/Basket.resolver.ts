import { Prisma } from "@prisma/client";
import { client } from "../../db";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import Basket from "./Basket.model";
import { BasketInterceptor, BasketLastUpdate } from "./middleware/Basket.middleware";
import { Context } from "../../graphql/context";

const BASKET_INCLUDE = {
                    product: {
                        include: {
                            book: true
                        }
                    }
};

@Resolver(Basket)
class BasketResolver {
    @Query((returns) => Basket, { nullable: true })
    @UseMiddleware(BasketInterceptor)
    async basket(@Ctx() context: Context) {
        return context.basket;
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
                include: BASKET_INCLUDE
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
                include: BASKET_INCLUDE
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
        const basketItem = context.basket?.basketItems.find((item) => item.product.id === productId);

        if (!basketItem) throw new Error("Basket item not found")

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

export default BasketResolver;
