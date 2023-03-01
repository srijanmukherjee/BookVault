import 'reflect-metadata';
import { ObjectType, Field, Resolver, Query, ID } from 'type-graphql';
import { client } from '../db';
import { Book } from './Book.model';

@ObjectType("Product")
export class Product {
    @Field(type => ID)
    id: number

    @Field(type => Book)
    book: Book

    @Field()
    bookId: number

    @Field()
    slug: string

    @Field()
    price: number

    @Field()
    discount: number

    @Field()
    featured: boolean

    @Field()
    rating: number
}

@Resolver(Product)
export class ProductResolver {
    @Query((returns) => [Product], { nullable: true })
    async products() {
        return client.product.findMany({
            include: {
                book: {
                    include: {
                        categories: true
                    }
                }
            }
        })
    }
}