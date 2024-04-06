import {
  MongoClient,
  ObjectId,
  FindOptions,
  AggregateOptions,
  InsertOneOptions,
  BulkWriteOptions,
  FindOneAndUpdateOptions,
  UpdateOptions,
  CountDocumentsOptions,
} from 'mongodb'
import { Obj, Query } from './types'
import Err from './error'

let client: MongoClient | null = null

export const connect = async () => {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI as string)
    await client.connect()
  }

  client.on('error', () => (client = null))
  client.on('connectionClosed', () => (client = null))

  return client
}

export const getCollection = async (cName: string) => {
  if (!client) {
    client = await connect()
  }

  return client.db().collection(cName)
}

export const oid = (id?: string) => {
  try {
    return new ObjectId(id)
  } catch (error) {
    throw new Err('invalid_id')
  }
}

export const startSession = async () => {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI as string)
    await client.connect()
  }

  return client.startSession()
}

export const find = async (
  cName: string,
  query = {},
  options?: FindOptions,
) => {
  const collection = await getCollection(cName)

  return collection.find(query, options).toArray()
}

export const findOne = async (
  cName: string,
  query: Query,
  options?: FindOptions,
) => {
  const collection = await getCollection(cName)

  if (query instanceof ObjectId) {
    query = { _id: query }
  } else if (typeof query === 'string') {
    query = { _id: oid(query) }
  }

  return collection.findOne(query as Obj, options)
}

export const aggregate = async (
  cName: string,
  pipeline: Obj[],
  options?: AggregateOptions,
) => {
  const collection = await getCollection(cName)

  return collection.aggregate(pipeline, options).toArray()
}

export const insertOne = async (
  cName: string,
  data: Obj,
  options?: InsertOneOptions,
) => {
  const collection = await getCollection(cName)
  const { insertedId } = await collection.insertOne(data, options)

  return { _id: insertedId, ...data }
}

export const insertMany = async (
  cName: string,
  data: Obj[],
  options?: BulkWriteOptions,
) => {
  const collection = await getCollection(cName)

  return collection.insertMany(data, options)
}

export const findOneAndUpdate = async (
  cName: string,
  query: Query,
  update: Obj,
  options?: FindOneAndUpdateOptions,
) => {
  const collection = await getCollection(cName)

  if (query instanceof ObjectId) {
    query = { _id: query }
  } else if (typeof query === 'string') {
    query = { _id: oid(query) }
  }

  const result = await collection.findOneAndUpdate(query as Obj, update, {
    upsert: false,
    returnDocument: 'after',
    ...options,
  })

  return result.value
}

export const updateOne = async (
  cName: string,
  query: Query,
  update: Obj,
  options?: UpdateOptions,
) => {
  const collection = await getCollection(cName)

  if (query instanceof ObjectId) {
    query = { _id: query }
  } else if (typeof query === 'string') {
    query = { _id: oid(query) }
  }

  const result = await collection.updateOne(query as Obj, update, {
    upsert: false,
    ...options,
  })

  return result
}

export const count = async (
  cName: string,
  query: Obj,
  options?: CountDocumentsOptions,
) => {
  const collection = await getCollection(cName)

  return collection.countDocuments(query, options)
}

export const exists = async (
  cName: string,
  query: Query,
  options?: CountDocumentsOptions,
) => {
  if (query instanceof ObjectId) {
    query = { _id: query }
  } else if (typeof query === 'string') {
    query = { _id: oid(query) }
  }

  const result = await count(cName, query, { ...options, limit: 1 })

  return result > 0
}
