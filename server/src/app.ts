import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import { buildSchemaSync } from 'type-graphql';
import { BookResolver } from './models/Book.model';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

const schema = buildSchemaSync({
  resolvers: [BookResolver],
})

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});