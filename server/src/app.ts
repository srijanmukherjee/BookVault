import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import { buildSchemaSync } from 'type-graphql';
import { BookResolver } from './models/Book.model';
import { CategoryResolver } from './models/Category.model';
import { ProductResolver } from './models/Product.model';
import cors from 'cors';
import { LanguageResolver } from './models/Language.model';
import { BasketResolver } from './models/Basket.model';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(cors({
  origin: ['http://localhost:8000']
}))

const schema = buildSchemaSync({
  resolvers: [BookResolver, CategoryResolver, ProductResolver, LanguageResolver, BasketResolver],
})

app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/graphql', graphqlHTTP((req, res) => {
  return {
    schema,
    graphiql: true,
    context: { req, res }
  }
}));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});