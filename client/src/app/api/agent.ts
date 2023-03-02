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

export type SortingOptions = 'RELEVANCE' | 'PRICE_HIGH_TO_LOW' | 'PRICE_LOW_TO_HIGH'

export interface SearchParams {
    page: number;
    itemsPerPage: number;
    search?: string;
    category?: number;
    sortBy?: SortingOptions
}

async function fetchProducts({ page, itemsPerPage, search, category, sortBy }: SearchParams = { page: 1, itemsPerPage: 20, sortBy: 'RELEVANCE' }) {
    return await client.query<PaginatedProductSchema>({
        query: FETCH_PRODUCTS,
        variables: {
            page, itemsPerPage, search, category, sortBy
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