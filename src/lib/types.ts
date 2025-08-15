import Context from './context'
import { ObjectId } from 'mongodb'

export interface RequestHandler {
    (ctx: Context): Promise<any>
}

export type PlainObject = {
    [key: string]: any
}

export type Query = string | ObjectId | PlainObject
