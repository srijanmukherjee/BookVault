import { Query, Resolver } from "type-graphql";
import Book from "./Book.model";
import { client } from "../../db";

@Resolver(Book)
class BookResolver {
    @Query((returns) => [Book], { nullable: true })
    async allBooks() {
        return client.book.findMany({
            include: {
                languages: true,
                categories: true,
                product: true
            },
        })
    }
}

export default BookResolver;