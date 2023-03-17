import { Request, Response } from "express";
import { IncomingMessage } from "http";
import { Basket } from "../models";

export interface Context extends IncomingMessage {
    res: Response,
    req: Request,
    basket?: Basket | null,
    user?: any
}

export interface UserPayload {
    email: string;
    firstName: string;
    lastName: string;
    iat: number;
}