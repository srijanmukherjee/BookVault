import Basket, { BasketItem } from "../models/basket";
import { Category, Language } from "../models/filters";
import { Product } from "../models/product";
import { User } from "../models/user";

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

export interface RemoveBasketItemSchema {
    removeBasketItem: Basket
}

export interface RegisterUserSchema {
    register: Partial<User>
}

export interface LoggedInUserSchema {
    login: {
        email: string;
        firstName: string;
        lastName: string;
        phonenumber?: string;
        emailVerified: boolean
        token: string;
        basket: Basket;
    }
}