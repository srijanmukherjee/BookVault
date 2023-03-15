import { Query, Resolver } from "type-graphql";
import Language from "./Language.model";
import { client } from "../../db";

@Resolver(Language)
class LanguageResolver {
    @Query((returns) => [Language], { nullable: true })
    async languages() {
        return client.language.findMany({
            include: {
                books: true
            }
        })
    }
}

export default LanguageResolver;