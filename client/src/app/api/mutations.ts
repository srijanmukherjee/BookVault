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
                    }
                    price
                    discount
                }
                quantity
            }
            lastUpdate
        }
    }
`