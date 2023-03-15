import { ObjectType, Field, ID } from "type-graphql"

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
}

export default Account;