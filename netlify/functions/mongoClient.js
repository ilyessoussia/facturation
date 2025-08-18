import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    await client.connect();
    return client.db('facturation');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export async function closeConnection() {
  try {
    await client.close();
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}
