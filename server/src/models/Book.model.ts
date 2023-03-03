import 'reflect-metadata';
import { ObjectType, Field, Resolver, Query } from 'type-graphql';
import { client } from '../db';
import { Language } from './Language.model';
import { Category } from './Category.model';
import { Product } from './Product.model';

@ObjectType("Book")
export class Book {
    @Field()
    id: number

    @Field()
    name: string

    @Field()
    author: string

    @Field()
    image: string

    @Field()
    format: string

    @Field()
    pages: number

    @Field(type => [Language])
    languages: Language[]

    @Field(type => [Category])
    categories: Category[]

    @Field(type => Product, { nullable: true })
    product?: Product
}

@Resolver(Book)
export class BookResolver {
    @Query((returns) => [Book], { nullable: true })
    async allBooks() {
        return client.book.findMany({
            include: {
                languages: true,
                categories: true,
                product: true
            }
        })
    }
}