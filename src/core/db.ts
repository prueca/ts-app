import { MongoClient, ObjectId, Dictionary, Filter } from './types'
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

export const find = async (cName: string, filter = {}, options?: Dictionary) => {
  const collection = await getCollection(cName)

  return collection.find(filter, options).toArray()
}

export const findOne = async (cName: string, filter: Filter, options?: Dictionary) => {
  const collection = await getCollection(cName)

  if (filter instanceof ObjectId) {
    filter = { _id: filter }
  } else if (typeof filter === 'string') {
    filter = { _id: oid(filter) }
  }

  return collection.findOne(filter as Dictionary, options)
}

export const aggregate = async (cName: string, pipeline: Dictionary[], options?: Dictionary) => {
  const collection = await getCollection(cName)

  return collection.aggregate(pipeline, options).toArray()
}

export const insertOne = async (cName: string, data: Dictionary, options?: Dictionary) => {
  const collection = await getCollection(cName)
  const { insertedId } = await collection.insertOne(data, options)

  return { _id: insertedId, ...data }
}

export const insertMany = async (cName: string, data: Dictionary[], options?: Dictionary) => {
  const collection = await getCollection(cName)

  return collection.insertMany(data, options)
}

export const findOneAndUpdate = async (cName: string, filter: Filter, update: Dictionary, options?: Dictionary) => {
  const collection = await getCollection(cName)

  if (filter instanceof ObjectId) {
    filter = { _id: filter }
  } else if (typeof filter === 'string') {
    filter = { _id: oid(filter) }
  }

  const result = await collection.findOneAndUpdate(filter as Dictionary, update, {
    upsert: false,
    returnDocument: 'after',
    ...options
  })

  return result.value
}

export const updateOne = async (cName: string, filter: Filter, update: Dictionary, options?: Dictionary) => {
  const collection = await getCollection(cName)

  if (filter instanceof ObjectId) {
    filter = { _id: filter }
  } else if (typeof filter === 'string') {
    filter = { _id: oid(filter) }
  }

  const result = await collection.updateOne(filter as Dictionary, update, {
    upsert: false,
    ...options
  })

  return result
}

export const count = async (cName: string, filter: Dictionary, options?: Dictionary) => {
  const collection = await getCollection(cName)

  return collection.countDocuments(filter, options)
}

export const exists = async (cName: string, filter: Filter, options?: Dictionary) => {
  if (filter instanceof ObjectId) {
    filter = { _id: filter }
  } else if (typeof filter === 'string') {
    filter = { _id: oid(filter) }
  }

  const result = await count(cName, filter, { ...options, limit: 1 })

  return result > 0
}