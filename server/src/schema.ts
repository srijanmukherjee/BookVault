import { buildSchemaSync } from 'type-graphql';
import { BasketResolver } from './models/Basket.model';
import { BookResolver } from './models/Book.model';
import { CategoryResolver } from './models/Category.model';
import { LanguageResolver } from './models/Language.model';
import { ProductResolver } from './models/Product.model';
import { AccountResolver } from './models/Account.model';

export const graphqlSchema = buildSchemaSync({
    resolvers: [BookResolver, CategoryResolver, ProductResolver, LanguageResolver, BasketResolver, AccountResolver],
    validate: {
        forbidUnknownValues: true,
    },
})