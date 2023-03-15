import { Field, ObjectType } from "type-graphql"
import Product from "../Product/Product.model"
import Category from "../Category/Category.model"
import Language from "../Language/Language.model"

@ObjectType("Book")
class Book {
    @Field()
    id: number

    @Field()
    name: string

    @Field()
    author: string

    @Field()
    description: string

    @Field()
    image: string

    @Field()
    format: string

    @Field()
    pages: number

    @Field(type => [Language])
    languages?: Language[]

    @Field(type => [Category])
    categories?: Category[]

    @Field(type => Product, { nullable: true })
    product?: Product
}

export default Book;