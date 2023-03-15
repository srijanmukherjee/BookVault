import { Query, Resolver } from "type-graphql";
import Category from "./Category.model";
import { client } from "../../db";

@Resolver(Category)
class CategoryResolver {
    @Query((returns) => [Category], { nullable: true })
    async categories() {
        return client.category.findMany({});
    }
}

export default CategoryResolver;