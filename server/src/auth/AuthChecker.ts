import "reflect-metadata";
import { AuthChecker, ResolverData } from "type-graphql";
import { Context, UserPayload } from "../graphql/context";
import { client } from "../db";
import { Account } from "../models";

export async function getAuthorizedUser(payload: UserPayload, roles: string[] = []): Promise<Account | null> {
    const { email } = payload;

    const user = await client.user.findUnique({
        where: {
            email
        }
    });

    return user;
}

export async function isAuthorized(payload: UserPayload, roles: string[] = []) {
    return getAuthorizedUser(payload, roles) !== null;
}

export const authChecker: AuthChecker<Context> = async ({ root, args, context, info }, roles) => {
    if (!context.user) return false;
    return await isAuthorized(context.user as UserPayload, roles);
}