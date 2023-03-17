import { Request, Router } from "express";
import { graphqlHTTP } from "express-graphql";
import { graphqlSchema as schema } from "../schema";
import { ValidationError } from "class-validator";
import { GraphQLError } from "graphql";
import { ArgumentValidationError } from "type-graphql";

const router = Router();

if (process.env.NODE_ENV !== 'production') {
    console.log('🟦 Graphiql activated')
}

router.use('/', graphqlHTTP((req: any, res) => {
    return {
        schema,
        graphiql: process.env.NODE_ENV !== 'production',
        context: { req: req as Request, res, user: req.auth },
        customFormatErrorFn(error: GraphQLError) {
            const extensions: any = { errors: [] };
            if (!error) return error;

            if (error.originalError instanceof ArgumentValidationError) {
                error.originalError.validationErrors.forEach((e) => {
                    if (!(e instanceof ValidationError)) return;
                    extensions.errors.push({ field: e.property, errors: e.constraints ? Object.keys(e.constraints).map((key) => e.constraints![key]) : [] })
                })
            }

            const formattedError = {
                ...error,
                extensions
            }

            return formattedError
        }
    }
}));

export default router;