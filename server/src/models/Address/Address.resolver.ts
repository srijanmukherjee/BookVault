import { Ctx, Query, Resolver } from "type-graphql";
import Address from "./Address.model";
import { Context } from "../../graphql/context";
import { getAuthorizedUser } from "../../auth/AuthChecker";
import { client } from "../../db";

@Resolver(of => Address)
class AddressResolver {

    @Query(returns => [Address], { description: "List of address for the logged in user" })
    async fetchAddressForAccount(@Ctx() context: Context) {
        if (!context.user) throw new Error("Not authenticated");

        const user = await getAuthorizedUser(context.user);

        if (!user) throw new Error("Not authorized");

        return client.address.findMany({
            where: {
                userId: user.id
            }
        });
    }
}

export default AddressResolver;