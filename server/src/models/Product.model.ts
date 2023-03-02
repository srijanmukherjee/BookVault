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
        const query = this.buildQuery(search, category);

        const [itemCount, products] = await client.$transaction([
            client.product.count({ where: query }),
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

                where: query,
            })
        ]);

        const totalPages = Math.ceil(itemCount / itemsPerPage);

        return { data: products, totalPages, currentPage: totalPages == 0 ? -1 : page, itemsPerPage, itemCount };
    }

    buildQuery(search?: string, category?: number): any {
        const query = {
            book: {}
        }

        if (category) {
            query.book = {
                ...query.book,
                categories: {
                    some: {
                        id: {
                            equals: category
                        }
                    }
                }
            }
        }

        if (search && search.length > 0) {
            query.book = {
                ...query.book,
                OR: [
                    {
                        name: {
                            contains: search
                        },
                    },
                    {
                        author: {
                            contains: search
                        }
                    }
                ]
            }
        }
        return query
    }
}