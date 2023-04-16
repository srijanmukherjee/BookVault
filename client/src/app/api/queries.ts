import { gql } from "@apollo/client";

export const FETCH_CATEGORIES = gql`
    query FetchCategories {
        categories {
            id
            name
        }
    }
`

export const FETCH_FILTERS = gql`
    query FetchFilters {
        categories {
            id
            name
        }

        languages {
            id
            name
        }
    } 
`

export const FETCH_PRODUCTS = gql`
    query FetchProducts($page: Int!, $itemsPerPage: Int!, $search: String, $category: Int, $sortBy: ProductSortingOption, $languages: [Int!], $rating: Int) {
        products(page: $page, itemsPerPage: $itemsPerPage, search: $search, category: $category, sortBy: $sortBy, languages: $languages, rating: $rating) {
            data {
                id
                book {
                    id
                    name
                    author
                    image
                    format
                    languages {
                        name
                    }
                }
                price
                discount
                featured
                rating
                slug
            }

            totalPages
            currentPage
            itemsPerPage
            itemCount
        }
    }
`

export const FETCH_PRODUCT = gql`
    query FetchProduct($slug: String!) {
        product(slug: $slug) {
            id
            price
            discount
            featured
            rating
            slug
            book {
                id
                name
                author
                image
                format
                languages {
                    name
                    id
                }
                categories {
                    name
                    id
                }
                description
            }
        }
    }
`

export const FETCH_PRODUCT_DESCRIPTION = gql`
    query FetchProductDescription($slug: String!) {
        product(slug: $slug) {
            id
            book {
                id
                description
                categories {
                    id
                    name
                }
            }
        }
    }
`

export const FETCH_BASKET = gql`
    query FetchBasket {
        basket {
            id,
            basketItems {
                id
                product {
                    id
                    book {
                        id
                        name
                        format
                        image
                    }
                    price
                    discount
                    slug
                }
                quantity
            }
            lastUpdate
        }
    }
`

export const LOGIN_USER = gql`
    query LOGIN_USER($email: String, $password: String) {
        login(email: $email, password: $password) {
            email
            firstName
            lastName
            emailVerified
            token
            basket {
                id,
                basketItems {
                    id
                    product {
                        id
                        book {
                            id
                            name
                            format
                            image
                        }
                        price
                        discount
                        slug
                    }
                    quantity
                }
                lastUpdate
            }
        }
    }
`