import { Max, Min } from "class-validator"
import { ArgsType, Field, Int, registerEnumType } from "type-graphql"
import { DEFAULT_ITEMS_PER_PAGE, MAX_ITEMS_PER_PAGE } from "../common/constants"

export enum ProductSortingType {
    RELEVANCE,
    PRICE_LOW_TO_HIGH,
    PRICE_HIGH_TO_LOW
}

registerEnumType(ProductSortingType, {
    name: "ProductSortingOption",
    description: "Accepted sorting modes"
})

@ArgsType()
export class ProductParams {
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