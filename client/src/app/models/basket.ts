import { Product } from "./product";

export interface BasketItem {
    id: number;
    quantity: number;
    product?: Product;
    productId?: number;
    basket?: Basket;
    basketId?: number;
}

export default interface Basket {
    id: string;
    basketItems: BasketItem[];
    lastUpdate: string;
}