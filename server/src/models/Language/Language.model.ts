import { Field, ID, ObjectType } from "type-graphql"
import Book from "../Book/Book.model"

@ObjectType("Language")
class Language {
    @Field(type => ID)
    id: number

    @Field()
    name: string

    @Field(type => [Book], { nullable: true })
    books: Book[]
}

export default Language;