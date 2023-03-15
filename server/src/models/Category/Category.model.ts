import { Field, ID, ObjectType } from "type-graphql"
import Book from "../Book/Book.model"

@ObjectType("Category")
class Category {
    @Field(type => ID)
    id: number

    @Field()
    name: string

    @Field(type => [Book], { nullable: true })
    books: Book[]
}

export default Category;