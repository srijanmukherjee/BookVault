import 'reflect-metadata';
import { ObjectType, Field, Resolver, Query, ID } from 'type-graphql';
import { client } from '../db';
import { Book } from './Book.model';

@ObjectType("Category")
export class Category {
    @Field(type => ID)
    id: number

    @Field()
    name: string

    @Field(type => [Book])
    books: Book[]
}

@Resolver(Category)
export class CategoryResolver {
    @Query((returns) => [Category], { nullable: true })
    async categories() {
        return client.category.findMany()
    }
}