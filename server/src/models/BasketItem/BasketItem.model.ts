import { Field, ID, ObjectType } from "type-graphql"
import Basket from "../Basket/Basket.model"
import Product from "../Product/Product.model"

@ObjectType("BasketItem")
class BasketItem {
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

export default BasketItem;