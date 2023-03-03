import { ApolloClient, InMemoryCache } from "@apollo/client";
import { FETCH_FILTERS, FETCH_PRODUCTS } from "./queries";
import { FiltersSchema, PaginatedProductSchema } from "./schema";

export const client = new ApolloClient({
    uri: 'http://localhost:8080/graphql',
    cache: new InMemoryCache(),
});

async function fetchFilters() {
    return await client.query<FiltersSchema>({
        query: FETCH_FILTERS,
    })
}

export type SortingOptions = 'RELEVANCE' | 'PRICE_HIGH_TO_LOW' | 'PRICE_LOW_TO_HIGH'

export interface SearchParams {
    page: number;
    itemsPerPage: number;
    search?: string;
    category?: number;
    sortBy?: SortingOptions;
    languages?: number[];
    rating?: number;
}

async function fetchProducts({ page, itemsPerPage, search, category, sortBy, languages, rating }: SearchParams = { page: 1, itemsPerPage: 20, sortBy: 'RELEVANCE' }) {
    return await client.query<PaginatedProductSchema>({
        query: FETCH_PRODUCTS,
        variables: {
            page, itemsPerPage, search, category, sortBy, languages, rating
        }
    })
}

const catalog = {
    fetchFilters,
    fetchProducts
}

export const requests = {
    catalog
}