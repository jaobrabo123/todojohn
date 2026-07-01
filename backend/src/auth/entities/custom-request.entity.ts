import { Request } from "express";

export interface RequestUser {
    sub: string;
    email: string;
}

export interface CustomRequest extends Request {
    user: RequestUser;
}
