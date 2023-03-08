import { ApolloClient, InMemoryCache } from "@apollo/client";
import { FETCH_BASKET, FETCH_FILTERS, FETCH_PRODUCT, FETCH_PRODUCTS, FETCH_PRODUCT_DESCRIPTION as FETCH_PRODUCT_DESCRIPTION_CATEGORIES } from "./queries";
import { BasketSchema, FiltersSchema, PaginatedProductSchema, ProductSchema } from "./schema";

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

async function fetchProduct(slug: string) {
    return await client.query<ProductSchema>({
        query: FETCH_PRODUCT,
        variables: {
            slug
        }
    })
}

async function fetchProductDescriptionCategoeries(slug: string) {
    return await client.query<ProductSchema>({
        query: FETCH_PRODUCT_DESCRIPTION_CATEGORIES,
        variables: {
            slug
        }
    })
}

async function fetchBasket() {
    return await client.query<BasketSchema>({
        query: FETCH_BASKET
    })
}

const catalog = {
    fetchFilters,
    fetchProducts,
    fetchProduct,
    fetchProductDescriptionCategoeries
}

const basket = {
    fetch: fetchBasket
}

export const requests = {
    catalog, basket
}