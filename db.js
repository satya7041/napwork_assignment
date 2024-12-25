// Database connection code

const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection URI from .env file
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';  // Default to local MongoDB
const dbName = process.env.DB_NAME || 'napwork';  // Default database name

let client;

async function connectToDb() {
  if (client) {
    return client;
  }

  try {
    // Create a new MongoClient and connect to the database
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB!");

    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw new Error("MongoDB connection failed");
  }
}

// Function to get the database instance
async function getDb() {
  const client = await connectToDb();
  return client.db(dbName);
}

// Close the database connection when needed
async function closeDb() {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

module.exports = { connectToDb, getDb, closeDb };
