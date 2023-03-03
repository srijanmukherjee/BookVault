import { Book } from "./book";

export interface Product {
    id?: number;
    slug?: string;
    book?: Book;
    bookId?: number;
    price?: number;
    discount?: number;
    featured?: boolean;
    rating?: number;
}