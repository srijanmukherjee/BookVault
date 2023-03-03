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

export interface PaginatedProductSchema extends ProductsSchema {
    products: {
        data: Product[],
        totalPages: number,
        currentPage: number,
        itemsPerPage: number,
        itemCount: number
    }
}