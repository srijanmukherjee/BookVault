import { IsEmail, IsMobilePhone, IsNotEmpty, IsPhoneNumber, MaxLength, MinLength, ValidationError } from "class-validator";
import { Arg, Args, ArgsType, ArgumentValidationError, Extensions, Field, ID, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { client } from "../db";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt"
import { v4 as uuid4 } from 'uuid'
import { sendVerificationEmail } from "../controller/emails";

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
    emailVerified: boolean

    @Field(type => Date)
    createdAt: Date
}

@ArgsType()
class RegistrationParams {
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

@Resolver(of => Account)
export class AccountResolver {

    @Mutation(returns => Account, { nullable: true, description: "Register a user" })
    async register(@Args({ validate: true }) { firstName, lastName, email, phonenumber, password }: RegistrationParams) {
        firstName = firstName.trim();
        lastName = lastName.trim();
        email = email.trim();
        phonenumber = phonenumber.trim();

        // check if account exists
        const user = await client.user.findFirst({
            where: {
                OR: [
                    {
                        email
                    },
                    {
                        phonenumber
                    }
                ]
            }
        })

        if (user !== null) {
            const errors = [];
            if (user.email === email) {
                errors.push(this.createValidationError('email', {
                    "accountExists": "Account with this email already exists"
                }));
            }

            if (user.phonenumber === phonenumber) {
                errors.push(this.createValidationError('phonenumber', {
                    "accountExists": "Account with this phone number already exists"
                }));
            }
            throw new ArgumentValidationError(errors)
        }

        // create account
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = uuid4();
        const account = await client.user.create({
            data: {
                firstName,
                lastName,
                email,
                phonenumber,
                emailToken: {
                    create: { token }
                },
                password: hashedPassword
            }
        });

        if (account === null) {
            throw new Error("Failed to create account")
        }

        // send confirmation email
        sendVerificationEmail(account, token);

        return account;
    }

    @Mutation(returns => Account, { nullable: true })
    async deleteAll() {
        await client.user.deleteMany();
        await client.verificationToken.deleteMany();
    }

    createValidationError(property: string, constraints: { [key: string]: string }) {
        const error = new ValidationError();
        error.property = property;
        error.constraints = constraints;
        return error;
    }
}