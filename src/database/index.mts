import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = process.env.MONGO_URI || "";
// console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let _db: MongoClient | null = null;

const initDb = async (callback:Function) => {
    // Check if the db is already initialized
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }
  // if the db is not initialized, connect to MongoDB
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    // set a reference to the db that will persist until the app shuts down because we are creating a closure!
    _db = client;
    console.log("Connected to MongoDB!");
    callback(null, _db);
  } catch (err) {
    callback(err);
  }
};

const getDb = () => {
  if (!_db) {
    throw Error('Db not initialized');
  }
  return _db.db(process.env.MONGO_DATABASE);
};

const closeDb = async () => {
  if (_db) {
    try {
      await _db.close();
    } finally {
      _db = null;
    }
  }
};

export default {
  initDb,
  getDb,
  closeDb,
};