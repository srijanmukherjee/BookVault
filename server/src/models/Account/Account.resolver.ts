import { ValidationError, isEmail } from "class-validator";
import { Resolver, Mutation, Args, ArgumentValidationError, Query, Ctx, Arg } from "type-graphql";
import { sendVerificationEmail } from "../../controller/emails";
import { client } from "../../db";
import Account, { LoggedInAccount } from "./Account.model";
import { v4 as uuid4 } from "uuid";
import bcrypt from "bcrypt";
import { RegistrationParams } from "./Account.params";
import jwt from "jsonwebtoken";
import { Context } from "../../graphql/context";
import { getAuthorizedUser, isAuthorized } from "../../auth/AuthChecker";

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

    @Query(returns => LoggedInAccount, { nullable: true, description: "Login" })
    async login(@Arg("email", { nullable: true }) email: string, @Arg("password", { nullable: true }) password: string, @Ctx() context: Context) {

        if (context.user) {
            const token = context.req.headers.authorization?.split(' ')[1];
            if (token) {
                const user = await getAuthorizedUser(context.user);
                if (user) return this.createLoginResponse(user, token);
            }
        }

        this.validateEmailPassword(email, password);

        const user = await client.user.findUnique({
            where: {
                email: email!
            }
        });

        if (!user) throw new ArgumentValidationError(
            [
                this.createValidationError(
                    "email",
                    {
                        "InvalidEmail": "We cannot find an account with that email address"
                    }
                )
            ]
        );

        const passwordMatch = await bcrypt.compare(password!, user.password);
        if (!passwordMatch) {
            throw new ArgumentValidationError(
                [
                    this.createValidationError(
                        "password",
                        {
                            "IncorrectPassword": "Your password is incorrect"
                        }
                    )
                ]
            );
        }

        const token = jwt.sign({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }, process.env.JWT_SECRET!, { algorithm: 'HS512', expiresIn: "1d" });

        return this.createLoginResponse(user, token);
    }

    @Mutation(returns => Account, { nullable: true })
    async deleteAll() {
        await client.user.deleteMany();
        await client.verificationToken.deleteMany();
    }

    createLoginResponse(user: Account, token: string) {
        return {
            email: user.email,
            phonenumber: user.phonenumber,
            token: token,
            firstName: user.firstName,
            lastName: user.lastName,
            emailVerified: user.emailVerified
        }
    }

    createValidationError(property: string, constraints: { [key: string]: string }): ValidationError {
        const error = new ValidationError();
        error.property = property;
        error.constraints = constraints;
        return error;
    }

    validateEmailPassword(email: string | null, password: string | null) {
        const errors = [];

        if (!isEmail(email)) {
            errors.push(this.createValidationError("email", { "InvalidEmail": "invalid email provided" }));
        }

        if (!password) {
            errors.push(this.createValidationError("password", { "PasswordNotProvided": "password not provided" }));
        }
        else if (password.length < 8) {
            errors.push(this.createValidationError("password", { "PasswordMinLength": "password must be minimum 8 characters long" }));
        } else if (password!.length > 52) {
            errors.push(this.createValidationError("password", { "PasswordMaxLength": "password must be maximum 52 characters long" }));
        }

        if (errors.length) {
            throw new ArgumentValidationError(errors);
        }
    }

}

export default AccountResolver;