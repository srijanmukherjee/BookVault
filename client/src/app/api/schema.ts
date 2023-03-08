import Basket, { BasketItem } from "../models/basket";
import { Category, Language } from "../models/filters";
import { Product } from "../models/product";

export interface CategoriesSchema {
    categories: Category[]
}

export interface FiltersSchema {
    categories: Category[];
    languages: Language[];
}

export interface ProductsSchema {
    products: {
        data: Product[]
    }
}

export interface ProductSchema {
    product: Product
}

export interface PaginatedProductSchema extends ProductsSchema {
    products: {
        data: Product[],
        totalPages: number,
        currentPage: number,
        itemsPerPage: number,
        itemCount: number
    }
}

export interface BasketSchema {
    basket: Basket
}

export interface AddBasketItemSchema {
    addBasketItem: Basket
}