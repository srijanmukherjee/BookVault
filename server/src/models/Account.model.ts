import { IsEmail, IsMobilePhone, IsPhoneNumber, MaxLength, MinLength } from "class-validator";
import { Arg, Args, ArgsType, Extensions, Field, ID, InputType, Mutation, ObjectType, Resolver } from "type-graphql";

@ObjectType("Account")
export class Account {
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
    verified: boolean

    @Field(type => Date)
    createdAt: Date
}

@ArgsType()
class RegistrationParams {
    @Field()
    firstName: string

    @Field()
    lastName: string

    @Field()
    @IsEmail({}, { message: "Invalid email provided" })
    email: string

    @Field()
    @IsPhoneNumber("IN", { message: 'Invalid phone number provided' })
    phonenumber: string

    @Field(type => String)
    @MinLength(8, { message: 'Password should be minimum 8 characters long' })
    @MaxLength(52, { message: 'Password should be maximum 52 characters long' })
    password: string
}

@Resolver(of => Account)
export class AccountResolver {

    @Mutation(returns => Account, { nullable: true, description: "Register a user" })
    async register(@Args({ validate: true }) params: RegistrationParams) {
        console.log(params);
    }
}