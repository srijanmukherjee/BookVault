import "reflect-metadata"
import BasketResolver from "./Basket/Basket.resolver";
import ProductResolver from "./Product/Product.resolver";
import AccountResolver from "./Account/Account.resolver";
import BookResolver from "./Book/Book.resolver";
import CategoryResolver from "./Category/Category.resolver";
import LanguageResolver from "./Language/Language.resolver";
import Account from "./Account/Account.model";
import Basket from "./Basket/Basket.model";
import BasketItem from "./BasketItem/BasketItem.model";
import Book from "./Book/Book.model";
import Category from "./Category/Category.model";
import Language from "./Language/Language.model";
import Product from "./Product/Product.model";
import { NonEmptyArray } from "type-graphql";
import Address from "./Address/Address.model";
import AddressResolver from "./Address/Address.resolver";

const resolvers: NonEmptyArray<Function> = [
    BasketResolver, ProductResolver, AccountResolver, BookResolver, CategoryResolver, LanguageResolver, AddressResolver
]

export {
    /* Resolvers */
    BasketResolver,
    ProductResolver,
    AccountResolver,
    BookResolver,
    CategoryResolver,
    LanguageResolver,
    AddressResolver,
    resolvers,
    /* Models */
    Account,
    Basket,
    BasketItem,
    Book,
    Category,
    Language,
    Product,
    Address
};