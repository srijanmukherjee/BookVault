import 'reflect-metadata';
import { ObjectType, Field, Resolver, Query, ID, ArgsType, Int, Args } from 'type-graphql';
import { client } from '../db';
import { Book } from './Book.model';
import { DEFAULT_ITEMS_PER_PAGE, MAX_ITEMS_PER_PAGE } from './constants';
import { Max, Min } from 'class-validator';
import { PaginatedResponse } from './PaginatedResponse'

@ObjectType("Product")
export class Product {
    @Field(type => ID)
    id: number

    @Field(type => Book)
    book: Book

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

@ArgsType()
class ProductParams {
    @Field(type => Int)
    @Min(1)
    page: number = 1

    @Field(type => Int)
    @Min(10)
    @Max(MAX_ITEMS_PER_PAGE)
    itemsPerPage: number = DEFAULT_ITEMS_PER_PAGE

    @Field({ nullable: true })
    search?: string

    @Field(type => Int, { nullable: true })
    category?: number
}

@ObjectType()
class PaginatedProductsResponse extends PaginatedResponse {
    @Field(type => [Product])
    data: Product[]
}

@Resolver(Product)
export class ProductResolver {
    @Query((returns) => PaginatedProductsResponse, { nullable: true })
    async products(@Args() { page, itemsPerPage, search, category }: ProductParams) {
        const [itemCount, products] = await client.$transaction([
            client.product.count(),
            client.product.findMany({
                include: {
                    book: {
                        include: {
                            categories: true
                        }
                    },
                },
                take: itemsPerPage,
                skip: (page - 1) * itemsPerPage,

                where: this.buildQuery(search, category)
            })
        ]);

        const totalPages = Math.ceil(itemCount / itemsPerPage);

        return { data: products, totalPages, currentPage: page, itemsPerPage, itemCount };
    }

    buildQuery(search?: string, category?: number): any {
        let query = {}

        if (category) {
            query = {
                ...query,
                book: {
                    categories: {
                        some: {
                            id: {
                                equals: category
                            }
                        }
                    }
                }
            }
        }
        return query
    }
}