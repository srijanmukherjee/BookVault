import { Field, ID, ObjectType } from "type-graphql";
import Account from "../Account/Account.model";

@ObjectType("Address")
class Address {
    @Field(type => ID)
    id: number;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    addressLine1: string;

    @Field()
    addressLine2?: string;

    @Field()
    city: string;

    @Field()
    state: string;

    @Field()
    country: string;

    @Field()
    zip: string;

    @Field()
    mobile: string;

    @Field(type => Account)
    user: Account;

    @Field()
    userId: number;
}

export default Address;