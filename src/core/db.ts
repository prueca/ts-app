import {
  MongoClient,
  ObjectId,
  Dict,
  Query,
  FindOptions,
  AggregateOptions,
  InsertOneOptions,
  BulkWriteOptions,
  FindOneAndUpdateOptions,
  UpdateOptions,
  CountDocumentsOptions,
} from './types'
import CustomError from './custom-error'

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
    throw new CustomError('invalid_id')
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

  return collection.findOne(query as Dict, options)
}

export const aggregate = async (
  cName: string,
  pipeline: Dict[],
  options?: AggregateOptions,
) => {
  const collection = await getCollection(cName)

  return collection.aggregate(pipeline, options).toArray()
}

export const insertOne = async (
  cName: string,
  data: Dict,
  options?: InsertOneOptions,
) => {
  const collection = await getCollection(cName)
  const { insertedId } = await collection.insertOne(data, options)

  return { _id: insertedId, ...data }
}

export const insertMany = async (
  cName: string,
  data: Dict[],
  options?: BulkWriteOptions,
) => {
  const collection = await getCollection(cName)

  return collection.insertMany(data, options)
}

export const findOneAndUpdate = async (
  cName: string,
  query: Query,
  update: Dict,
  options?: FindOneAndUpdateOptions,
) => {
  const collection = await getCollection(cName)

  if (query instanceof ObjectId) {
    query = { _id: query }
  } else if (typeof query === 'string') {
    query = { _id: oid(query) }
  }

  const result = await collection.findOneAndUpdate(query as Dict, update, {
    upsert: false,
    returnDocument: 'after',
    ...options,
  })

  return result.value
}

export const updateOne = async (
  cName: string,
  query: Query,
  update: Dict,
  options?: UpdateOptions,
) => {
  const collection = await getCollection(cName)

  if (query instanceof ObjectId) {
    query = { _id: query }
  } else if (typeof query === 'string') {
    query = { _id: oid(query) }
  }

  const result = await collection.updateOne(query as Dict, update, {
    upsert: false,
    ...options,
  })

  return result
}

export const count = async (
  cName: string,
  query: Dict,
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
