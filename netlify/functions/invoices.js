import { connectToDatabase, closeConnection } from './mongoClient.js';

export async function handler(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  let db;
  try {
    db = await connectToDatabase();
    const collection = db.collection('invoices');

    switch (event.httpMethod) {
      case 'GET':
        return await handleGet(event, collection, headers);
      case 'POST':
        return await handlePost(event, collection, headers);
      case 'PUT':
        return await handlePut(event, collection, headers);
      case 'DELETE':
        return await handleDelete(event, collection, headers);
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    if (db) {
      await closeConnection();
    }
  }
}

async function handleGet(event, collection, headers) {
  try {
    const { id } = event.queryStringParameters || {};
    
    if (id) {
      // Get single invoice
      const invoice = await collection.findOne({ id });
      if (!invoice) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Invoice not found' })
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(invoice)
      };
    } else {
      // Get all invoices
      const invoices = await collection.find({}).sort({ created_at: -1 }).toArray();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(invoices)
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error fetching invoices' })
    };
  }
}

async function handlePost(event, collection, headers) {
  try {
    const invoice = JSON.parse(event.body);
    
    // Validate required fields
    if (!invoice.invoice_number || !invoice.client_name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Add timestamp if not present
    if (!invoice.created_at) {
      invoice.created_at = new Date().toISOString();
    }

    const result = await collection.insertOne(invoice);
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ 
        message: 'Invoice created successfully',
        id: result.insertedId 
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error creating invoice' })
    };
  }
}

async function handlePut(event, collection, headers) {
  try {
    const { id } = event.queryStringParameters || {};
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invoice ID required' })
      };
    }

    const updates = JSON.parse(event.body);
    const result = await collection.updateOne(
      { id },
      { $set: { ...updates, updated_at: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Invoice not found' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Invoice updated successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error updating invoice' })
    };
  }
}

async function handleDelete(event, collection, headers) {
  try {
    const { id } = event.queryStringParameters || {};
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invoice ID required' })
      };
    }

    const result = await collection.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Invoice not found' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Invoice deleted successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error deleting invoice' })
    };
  }
}
