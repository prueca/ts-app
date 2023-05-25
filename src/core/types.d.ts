import Context from './context'
import { MongoClient, ObjectId, Document, ClientSession } from 'mongodb'

export interface RequestHandler {
  (ctx: Context): Promise<any>
}

export interface Dictionary {
  [key: string]: any
}

export type Filter = string | ObjectId | Dictionary

export { MongoClient, ObjectId, Document, ClientSession }
