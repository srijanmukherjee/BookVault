import { gql } from "@apollo/client";

export const MUTATE_ADD_ITEM = gql`
    mutation AddProduct($productId: Float!, $quantity: Float!) {
        addBasketItem(productId: $productId, quantity: $quantity) {
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