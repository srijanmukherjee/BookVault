import { IsNotEmpty, IsEmail, IsPhoneNumber, MinLength, MaxLength } from "class-validator"
import { ArgsType, Field } from "type-graphql"

@ArgsType()
export class RegistrationParams {
    @Field()
    @IsNotEmpty({ message: 'First name cannot be empty' })
    firstName: string

    @Field()
    @IsNotEmpty({ message: 'Last name cannot be empty' })
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