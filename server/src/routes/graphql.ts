import { Router } from "express";
import { RequestInfo, graphqlHTTP } from "express-graphql";
import { graphqlSchema as schema } from "../schema";
import { ValidationError } from "class-validator";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { ArgumentValidationError } from "type-graphql";

const router = Router();

if (process.env.NODE_ENV !== 'production') {
    console.log('🟦 Graphiql activated')
}

router.use('/', graphqlHTTP((req, res) => {
    return {
        schema,
        graphiql: process.env.NODE_ENV !== 'production',
        context: { req, res },
        extensions(info) {
            const extensions: any = { errors: [] };
            if (!info.result.errors) return extensions;

            for (const error of info.result.errors) {
                if (!(error instanceof GraphQLError)) continue;

                if (error.originalError instanceof ArgumentValidationError) {
                    error.originalError.validationErrors.forEach((e) => {
                        if (!(e instanceof ValidationError)) return;
                        extensions.errors.push({ field: e.property, errors: e.constraints ? Object.keys(e.constraints).map((key) => e.constraints![key]) : [] })
                    })
                }
            }

            return extensions
        },
    }
}));

export default router;