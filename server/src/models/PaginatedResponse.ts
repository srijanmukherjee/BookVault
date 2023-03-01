import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PaginatedResponse {
    @Field()
    totalPages: number;

    @Field()
    currentPage: number;

    @Field()
    itemsPerPage: number;

    @Field()
    itemCount: number;
}