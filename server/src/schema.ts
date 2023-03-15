import { buildSchemaSync } from 'type-graphql';
import { resolvers } from './models';

export const graphqlSchema = buildSchemaSync({
    resolvers,
    validate: {
        forbidUnknownValues: true,
    },
})