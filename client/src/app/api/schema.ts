import { Category } from "../models/filters";
import { Product } from "../models/product";

export interface CategoriesSchema {
    categories: Category[]
}

export interface ProductsSchema {
    products: {
        data: Product[]
    }
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