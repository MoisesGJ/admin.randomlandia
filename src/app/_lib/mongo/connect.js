import "server-only";

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

let cachedClient;
let cachedDb;
let cachedDbName;


export async function connectToDatabase(dbName) {
  const MONGODB_DB = dbName || process.env.MONGODB_DB;


  if (cachedClient && cachedDb && cachedDbName === MONGODB_DB) {
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
    cachedDbName = MONGODB_DB

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
