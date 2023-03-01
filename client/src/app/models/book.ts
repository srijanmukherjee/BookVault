import { Category } from "./filters";
import { Product } from "./product";

export interface Book {
    id?: number;
    name: string;
    author: string;
    image: string;
    pages?: number;
    format?: string;
    categories: Category[];
    product?: Product
}