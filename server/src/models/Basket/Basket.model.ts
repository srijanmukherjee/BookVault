import { ObjectType, Field, ID } from "type-graphql";
import BasketItem from "../BasketItem/BasketItem.model";
import Account from "../Account/Account.model";

@ObjectType("Basket")
class Basket {
    @Field(type => ID)
    id: string

    @Field(type => [BasketItem])
    basketItems: BasketItem[]

    @Field(type => Date)
    lastUpdate: Date

    @Field(type => Account, { nullable: true })
    user?: Account | null

    @Field(type => String, { nullable: true })
    userEmail: string | null
}

export default Basket;