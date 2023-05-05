import { MongoClient, ObjectId } from 'mongodb'
import { JSON } from '@/type-def'

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
  if (id) return new ObjectId(id)

  return new ObjectId()
}

export const find = async (cName: string) => {
  const collection = await getCollection(cName)

  return collection.find().toArray()
}

export const insertOne = async (cName: string, data: JSON, options?: JSON) => {
  const collection = await getCollection(cName)

  return collection.insertOne(data, options)
}

export const findOne = async (cName: string, filter: JSON, options?: JSON) => {
  const collection = await getCollection(cName)

  return collection.findOne(filter, options)
}

export const count = async (cName: string, filter: JSON, options?: JSON) => {
  const collection = await getCollection(cName)

  return collection.countDocuments(filter, options)
}