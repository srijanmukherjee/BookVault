import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from "@apollo/client";
import { FETCH_BASKET, FETCH_FILTERS, FETCH_PRODUCT, FETCH_PRODUCTS, FETCH_PRODUCT_DESCRIPTION as FETCH_PRODUCT_DESCRIPTION_CATEGORIES, LOGIN_USER } from "./queries";
import { AddBasketItemSchema, BasketSchema, FiltersSchema, LoggedInUserSchema, PaginatedProductSchema, ProductSchema, RegisterUserSchema, RemoveBasketItemSchema } from "./schema";
import { MUTATE_ADD_ITEM, MUTATE_REGISTER_USER, MUTATE_REMOVE_ITEM } from "./mutations";
import { User } from "../models/user";

export const LOCAL_STORAGE_AUTH_KEY = 'token'

const link = createHttpLink({
    uri: 'http://localhost:8080/graphql',
    credentials: 'include',
})

const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);

    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : ''
        }
    })

    return forward(operation);
})

export const client = new ApolloClient({
    link: authLink.concat(link),
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

export type RegistrationParams = Partial<User> & {
    password: string;
}

function registerUser(user: RegistrationParams, signal?: AbortSignal) {
    return client.mutate<RegisterUserSchema>({
        mutation: MUTATE_REGISTER_USER,
        variables: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phonenumber: user.phonenumber,
            password: user.password
        },
        context: {
            fetchOptions: {
                signal
            }
        }

    })
}

function loginUser(email?: string, password?: string) {
    return client.query<LoggedInUserSchema>({
        query: LOGIN_USER,
        variables: { email, password }
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

const account = {
    register: registerUser,
    login: loginUser
}

export const requests = {
    catalog, basket, account
}