import { Field, ID, Int, ObjectType } from "type-graphql"
import Book from "../Book/Book.model"
import { PaginatedResponse } from "../common/PaginatedResponse"

@ObjectType("Product")
class Product {
    @Field(type => ID)
    id: number

    @Field(type => Book, { nullable: true })
    book?: Book

    @Field(type => Int)
    bookId: number

    @Field()
    slug: string

    @Field(type => Int)
    price: number

    @Field()
    discount: number

    @Field()
    featured: boolean

    @Field()
    rating: number
}

@ObjectType()
export class PaginatedProductsResponse extends PaginatedResponse {
    @Field(type => [Product])
    data: Product[]
}

export default Product;