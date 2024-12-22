// app/lib/db.js
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

let cachedClient = null

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient.db('smartsign')
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI)
  cachedClient = client
  return client.db('smartsign')
}