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
    query FetchProducts {
        products {
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