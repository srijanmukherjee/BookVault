import { gql } from "@apollo/client";

export const FETCH_CATEGORIES = gql`
    query FetchCategories {
        categories {
            id
            name
        }
    }
`

export const FETCH_PRODUCTS = gql`
    query FetchProducts($page: Int!, $itemsPerPage: Int!, $search: String, $category: Int, $sortBy: ProductSortingOption) {
        products(page: $page, itemsPerPage: $itemsPerPage, search: $search, category: $category, sortBy: $sortBy) {
            data {
                id
                book {
                    name
                    author
                    image
                    format
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