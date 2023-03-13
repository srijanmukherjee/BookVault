import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { FETCH_BASKET, FETCH_FILTERS, FETCH_PRODUCT, FETCH_PRODUCTS, FETCH_PRODUCT_DESCRIPTION as FETCH_PRODUCT_DESCRIPTION_CATEGORIES } from "./queries";
import { AddBasketItemSchema, BasketSchema, FiltersSchema, PaginatedProductSchema, ProductSchema, RemoveBasketItemSchema } from "./schema";
import { MUTATE_ADD_ITEM, MUTATE_REMOVE_ITEM } from "./mutations";


const link = createHttpLink({
    uri: 'http://localhost:8080/graphql',
    credentials: 'include'
})

export const client = new ApolloClient({
    link,
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

async function addItemToBasket(productId: number, quantity: number) {
    return await client.mutate<AddBasketItemSchema>({
        mutation: MUTATE_ADD_ITEM,
        variables: { productId: parseInt(productId.toString()), quantity: parseInt(quantity.toString()) }
    })
}

async function removeItemFromBasket(productId: number) {
    return await client.mutate<RemoveBasketItemSchema>({
        mutation: MUTATE_REMOVE_ITEM,
        variables: { productId: parseInt(productId.toString()) }
    })
}

const catalog = {
    fetchFilters,
    fetchProducts,
    fetchProduct,
    fetchProductDescriptionCategoeries
}

const basket = {
    fetch: fetchBasket,
    add: addItemToBasket,
    remove: removeItemFromBasket
}

export const requests = {
    catalog, basket
}