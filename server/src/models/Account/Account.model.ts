import { ObjectType, Field, ID } from "type-graphql"
import Basket from "../Basket/Basket.model"

@ObjectType("Account")
class Account {
    @Field(type => ID)
    id: number

    @Field()
    email: string

    @Field()
    phonenumber: string

    @Field()
    firstName: string

    @Field()
    lastName: string

    @Field(type => Boolean)
    emailVerified: boolean

    @Field(type => Date)
    createdAt: Date

    @Field()
    token?: string;

    @Field(type => Basket, { nullable: true })
    basket?: Basket | null;

    @Field(type => String, { nullable: true })
    basketId?: string | null;
}

export default Account;