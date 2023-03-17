import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import graphqlRouter from "./routes/graphql"
import transporter from './controller/mail';
import { expressjwt } from "express-jwt";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(cors({
  origin: ['http://localhost:8000'],
  credentials: true
}))

app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
  res.send('Oops! you are not supposed to access this.');
});

app.use(
  '/graphql',
  expressjwt({
    secret: process.env.JWT_SECRET!,
    algorithms: ["HS512"],
    credentialsRequired: false
  }),
  graphqlRouter);

transporter.verify(function (error, success) {
  if (error) {
    console.log('🟥 Mail transporter verification failed')
  } else {
    console.log("🟩 Mail transporter ready");
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
