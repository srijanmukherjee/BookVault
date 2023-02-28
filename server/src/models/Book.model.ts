import 'reflect-metadata';
import { ObjectType, Field, ID, buildSchemaSync, Resolver, Query } from 'type-graphql';
import { client } from '../db';

@ObjectType()
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
    pages: number
}

@Resolver(Book)
export class BookResolver {
    @Query((returns) => [Book], { nullable: true })
    async allBooks() {
        return client.book.findMany()
    }
}