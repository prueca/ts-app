import { MongoClient, ObjectId } from 'mongodb'
import { JSON } from '@/type-def'
import { errors } from '@/util'

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
    throw new Error(errors.invalid_id)
  }
}

export const find = async (cName: string) => {
  const collection = await getCollection(cName)

  return collection.find().toArray()
}

export const insertOne = async (cName: string, data: JSON, options?: JSON) => {
  const collection = await getCollection(cName)
  const { insertedId } = await collection.insertOne(data, options)

  return { _id: insertedId, ...data }
}

export const findOne = async (cName: string, filter: JSON, options?: JSON) => {
  const collection = await getCollection(cName)

  return collection.findOne(filter, options)
}

export const findOneAndUpdate = async (cName: string, filter: JSON, update: JSON, options?: JSON) => {
  const collection = await getCollection(cName)
  const result = await collection.findOneAndUpdate(filter, update, {
    upsert: false,
    returnDocument: 'after',
    ...options
  })

  return result.value
}

export const count = async (cName: string, filter: JSON, options?: JSON) => {
  const collection = await getCollection(cName)

  return collection.countDocuments(filter, options)
}