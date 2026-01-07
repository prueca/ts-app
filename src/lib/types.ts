import { NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import Context from './context'

export interface RequestHandler {
    (ctx: Context): Promise<any>
}

export interface Middleware {
    (ctx: Context, next: NextFunction): Promise<any>
}

export type PlainObject = {
    [key: string]: any
}

export type Query = string | ObjectId | PlainObject
