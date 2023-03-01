import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { FETCH_CATEGORIES, FETCH_PRODUCTS } from "./queries";
import { CategoriesSchema, PaginatedProductSchema } from "./schema";

export const client = new ApolloClient({
    uri: 'http://localhost:8080/graphql',
    cache: new InMemoryCache(),
});

async function fetchCategories() {
    return await client.query<CategoriesSchema>({
        query: FETCH_CATEGORIES,
    })
}

export interface SearchParams {
    page: number;
    itemsPerPage: number;
    search?: string;
    category?: number;
}

async function fetchProducts({ page, itemsPerPage, search, category }: SearchParams = { page: 1, itemsPerPage: 20 }) {
    return await client.query<PaginatedProductSchema>({
        query: FETCH_PRODUCTS,
        variables: {
            page, itemsPerPage, search, category
        }
    })
}

const catalog = {
    fetchCategories,
    fetchProducts
}

export const requests = {
    catalog
}