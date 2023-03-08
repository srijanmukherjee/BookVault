import { Field, ID, ObjectType } from "type-graphql"
import { Basket } from "./Basket.model"
import { Product } from "./Product.model"

@ObjectType("BasketItem")
export class BasketItem {
    @Field(type => ID)
    id: number

    @Field(type => Product)
    product: Product

    @Field()
    productId: number

    @Field()
    quantity: number

    @Field(type => Basket, { nullable: true })
    basket?: Basket

    @Field()
    basketId: string
}