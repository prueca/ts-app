import { MongoClient, ObjectId } from 'mongodb'
import { Dictionary } from './types'
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
  } catch (error: Error | unknown) {
    throw new CustomError('invalid_id')
  }
}

export const find = async (cName: string) => {
  const collection = await getCollection(cName)

  return collection.find().toArray()
}

export const insertOne = async (cName: string, data: Dictionary, options?: Dictionary) => {
  const collection = await getCollection(cName)
  const { insertedId } = await collection.insertOne(data, options)

  return { _id: insertedId, ...data }
}

export const findOne = async (cName: string, filter: Dictionary, options?: Dictionary) => {
  const collection = await getCollection(cName)

  return collection.findOne(filter, options)
}

export const findOneAndUpdate = async (cName: string, filter: Dictionary, update: Dictionary, options?: Dictionary) => {
  const collection = await getCollection(cName)
  const result = await collection.findOneAndUpdate(filter, update, {
    upsert: false,
    returnDocument: 'after',
    ...options
  })

  return result.value
}

export const count = async (cName: string, filter: Dictionary, options?: Dictionary) => {
  const collection = await getCollection(cName)

  return collection.countDocuments(filter, options)
}