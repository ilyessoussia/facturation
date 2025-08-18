// Simple test to verify MongoDB connection
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/facturation';

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔌 Testing MongoDB connection...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    const db = client.db('facturation');
    const collection = db.collection('invoices');
    
    // Test a simple operation
    const count = await collection.countDocuments();
    console.log(`📊 Current invoice count: ${count}`);
    
    console.log('🎉 All tests passed! Your setup is ready.');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('1. Set up MongoDB Atlas account');
    console.log('2. Add MONGODB_URI to environment variables');
    console.log('3. Allow network access from all IPs');
  } finally {
    await client.close();
  }
}

testConnection();
