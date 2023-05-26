import Context from './context'
import {
  MongoClient,
  ObjectId,
  Document,
  ClientSession,
  FindOptions,
  AggregateOptions,
  InsertOneOptions,
  BulkWriteOptions,
  FindOneAndUpdateOptions,
  UpdateOptions,
  CountDocumentsOptions,
} from 'mongodb'

export interface RequestHandler {
  (ctx: Context): Promise<any>
}

export type Dict = {
  [key: string]: any
}

export type Query = string | ObjectId | Dict

export {
  MongoClient,
  ObjectId,
  Document,
  ClientSession,
  FindOptions,
  AggregateOptions,
  InsertOneOptions,
  BulkWriteOptions,
  FindOneAndUpdateOptions,
  UpdateOptions,
  CountDocumentsOptions,
}
