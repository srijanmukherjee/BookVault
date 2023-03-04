import 'reflect-metadata';
import { ObjectType, Field, Resolver, Query, ID, ArgsType, Int, Args, registerEnumType, Arg } from 'type-graphql';
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

enum ProductSortingType {
    RELEVANCE,
    PRICE_LOW_TO_HIGH,
    PRICE_HIGH_TO_LOW
}

registerEnumType(ProductSortingType, {
    name: "ProductSortingOption",
    description: "Accepted sorting modes"
})

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

    @Field(type => ProductSortingType, { nullable: true })
    sortBy?: ProductSortingType = ProductSortingType.RELEVANCE

    @Field(type => Int, { nullable: true })
    rating?: number

    @Field(type => [Int], { nullable: true })
    languages?: number[]
}

@ObjectType()
class PaginatedProductsResponse extends PaginatedResponse {
    @Field(type => [Product])
    data: Product[]
}

@Resolver(Product)
export class ProductResolver {
    @Query((returns) => PaginatedProductsResponse, { nullable: true })
    async products(@Args() { page, itemsPerPage, search, category, sortBy, rating, languages }: ProductParams) {
        const { where, orderBy } = this.buildQuery(search, category, sortBy, rating, languages);

        const [itemCount, products] = await client.$transaction([
            client.product.count({ where }),
            client.product.findMany({
                include: {
                    book: {
                        include: {
                            categories: true,
                            languages: true,
                            product: true
                        },
                    },
                },
                take: itemsPerPage,
                skip: (page - 1) * itemsPerPage,

                where,
                orderBy
            })
        ]);

        const totalPages = Math.ceil(itemCount / itemsPerPage);

        return { data: products, totalPages, currentPage: totalPages == 0 ? -1 : page, itemsPerPage, itemCount };
    }

    @Query((returns) => Product, { nullable: true })
    async product(@Arg("slug") slug: string) {
        return client.product.findFirst({
            where: {
                slug: {
                    equals: slug
                }
            },
            include: {
                book: {
                    include: {
                        categories: true,
                        languages: true
                    }
                }
            }
        })
    }

    buildQuery(search?: string, category?: number, sortBy?: ProductSortingType, rating?: number, languages?: number[]): any {
        const query = {
            book: {},
            rating: {}
        }

        const orderBy: any = {}

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

        if (rating) {
            query.rating = {
                gte: rating
            }
        }

        if (languages && languages.length > 0) {
            query.book = {
                ...query.book,
                OR: languages.map((id) => ({
                    languages: {
                        some: {
                            id
                        }
                    }
                }))
            }
        }

        if (search && search.length > 0) {
            query.book = {
                ...query.book,
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        },
                    },
                    {
                        author: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ],
            }
        }

        if (sortBy == null) sortBy = ProductSortingType.RELEVANCE;

        switch (sortBy) {
            case ProductSortingType.RELEVANCE:
                // TODO: Produces error, problem with prisma. Bug: https://github.com/prisma/prisma/issues/12247
                // if (search && search.length > 0) {
                //     orderBy._relevance = {
                //         fields: ['book.name'],
                //         sort: 'asc',
                //         search
                //     }
                // }
                break;

            case ProductSortingType.PRICE_LOW_TO_HIGH:
                orderBy.price = 'asc'
                break;

            case ProductSortingType.PRICE_HIGH_TO_LOW:
                orderBy.price = 'desc'
                break;
        }

        return { where: query, orderBy }
    }
}