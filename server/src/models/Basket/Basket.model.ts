import { ObjectType, Field, ID } from "type-graphql";
import BasketItem from "../BasketItem/BasketItem.model";

@ObjectType("Basket")
class Basket {
    @Field(type => ID)
    id: string

    @Field(type => [BasketItem])
    basketItems: BasketItem[]

    @Field(type => Date)
    lastUpdate: Date
}

export default Basket;