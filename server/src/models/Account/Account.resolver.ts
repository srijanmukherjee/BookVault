import { ValidationError } from "class-validator";
import { Resolver, Mutation, Args, ArgumentValidationError, Query } from "type-graphql";
import { sendVerificationEmail } from "../../controller/emails";
import { client } from "../../db";
import Account from "./Account.model";
import { v4 as uuid4 } from "uuid";
import bcrypt from "bcrypt";
import { RegistrationParams } from "./Account.params";
import jwt from "jsonwebtoken";

@Resolver(of => Account)
class AccountResolver {

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

    @Query(returns => Account, { nullable: true, description: "Login" })
    async login() {
        const token = jwt.sign({
            email: "21051770@kiit.ac.in",
            firstName: "Srijan",
            lastName: "Mukherjee"
        }, process.env.JWT_SECRET!, { algorithm: 'HS512' });

        return { token }
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

export default AccountResolver;