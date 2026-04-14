import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? "raptornet";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientOptions = {
  maxPoolSize: 5,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

function getClientPromise() {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri, clientOptions).connect();
  }

  return global._mongoClientPromise;
}

export async function getDb() {
  const connectedClient = await getClientPromise();
  return connectedClient.db(dbName);
}
