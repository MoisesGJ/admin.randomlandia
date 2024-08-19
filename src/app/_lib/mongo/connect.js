import "server-only";

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

let cachedClient;
let cachedDb;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  if (!MONGODB_URI) {
    throw new Error("Define the MONGODB_URI environmental variable");
  }

  if (!MONGODB_DB) {
    throw new Error("Define the MONGODB_DB environmental variable");
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(MONGODB_DB);

    cachedClient = client;
    cachedDb = db;

    return {
      client: cachedClient,
      db: cachedDb,
    };
  } catch (error) {
    console.error("Failed to connect to the database", error);
    throw error;
  }
}

process.on("SIGINT", async () => {
  if (cachedClient) {
    await cachedClient.close();
    process.exit(0);
  }
});
