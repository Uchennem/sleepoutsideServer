import { MongoClient, ServerApiVersion } from "mongodb";
import { products } from "./products.js";
import dotenv from "dotenv";
import * as argon2 from "argon2";

dotenv.config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// -------------------------
// Helper: Drop collection only if it exists
// -------------------------
async function dropIfExists(db, collectionName) {
  const exists = await db.listCollections({ name: collectionName }).hasNext();
  if (exists) {
    await db.collection(collectionName).drop();
    console.log(`Collection '${collectionName}' dropped successfully`);
  } else {
    console.log(`Collection '${collectionName}' does not exist (skipping drop)`);
  }
}

// -------------------------
// Helper: Convert PascalCase keys to camelCase (and handle nested objects/arrays)
// -------------------------
const lowerCaseKeys = function (obj) {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === "object" ? lowerCaseKeys(item) : item
    );
  }

  if (typeof obj === "object") {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      const newKey = key[0].toLowerCase() + key.slice(1);
      const val = obj[key];
      newObj[newKey] = typeof val === "object" ? lowerCaseKeys(val) : val;
    }
    return newObj;
  }

  return obj;
};

// -------------------------
// 1) PRODUCTS
// -------------------------
const seedProducts = async (db) => {
  try {
    await dropIfExists(db, "products");

    const productsCollection = db.collection("products");
    console.log("Collection 'products' ready");

    // Transform: Reviews.ReviewUrl -> /products/<productId>/reviews/
    const transformedProducts = products.map((product) => {
      const copy = { ...product };

      // Handle Reviews being an array or a single object
      if (Array.isArray(copy.Reviews)) {
        copy.Reviews = copy.Reviews.map((r) => ({
          ...r,
          ReviewUrl: `/products/${copy.Id}/reviews/`,
        }));
      } else if (copy.Reviews && typeof copy.Reviews === "object") {
        copy.Reviews.ReviewUrl = `/products/${copy.Id}/reviews/`;
      }

      return copy;
    });

    // Convert keys to camelCase before inserting (Id -> id, etc.)
    const productsToInsert = transformedProducts.map(lowerCaseKeys);

    const result = await productsCollection.insertMany(productsToInsert);
    console.log(`${result.insertedCount} product(s) inserted`);
  } catch (error) {
    console.error("seedProducts error:", error.message);
  }
};

// -------------------------
// 2) ALERTS
// -------------------------
const seedAlerts = async (db) => {
  try {
    await dropIfExists(db, "alerts");

    const alertsCollection = db.collection("alerts");
    console.log("Collection 'alerts' ready");

    // Minimal seed (ok for now unless your class provides a schema)
    const seedAlertsData = [
      {
        type: "inventory",
        message: "Low stock warning example",
        productId: "demo-product-id",
        createdAt: new Date(),
        read: false,
      },
    ];

    const result = await alertsCollection.insertMany(seedAlertsData);
    console.log(`${result.insertedCount} alert(s) inserted`);
  } catch (error) {
    console.error("seedAlerts error:", error.message);
  }
};

// -------------------------
// 3) ORDERS
// -------------------------
const seedOrders = async (db) => {
  try {
    await dropIfExists(db, "orders");

    const ordersCollection = db.collection("orders");
    console.log("Collection 'orders' ready");

    const seedOrdersData = [
      {
        userId: "demo-user-id",
        items: [{ productId: "demo-product-id", quantity: 1, unitPrice: 29.99 }],
        status: "pending",
        subtotal: 29.99,
        tax: 0,
        total: 29.99,
        createdAt: new Date(),
      },
    ];

    const result = await ordersCollection.insertMany(seedOrdersData);
    console.log(`${result.insertedCount} order(s) inserted`);
  } catch (error) {
    console.error("seedOrders error:", error.message);
  }
};

// -------------------------
// 4) USERS (with argon2 hashed password)
// -------------------------
const seedUsers = async (db) => {
  try {
    await dropIfExists(db, "users");

    const usersCollection = db.collection("users");
    console.log("Collection 'users' ready");

    const now = new Date();

    // Requirement: use argon2 to hash before storing
    const hashedPassword = await argon2.hash("password");

    // Requirement fields: name, email, password, createdAt, modifiedAt
    const testUser = {
      name: "Test User",
      email: "testuser@example.com",
      password: hashedPassword,
      createdAt: now,
      modifiedAt: now,
    };

    const result = await usersCollection.insertOne(testUser);
    console.log(`1 user inserted with id: ${result.insertedId}`);
  } catch (error) {
    console.error("seedUsers error:", error.message);
  }
};

// -------------------------
// 5) INDEXES (must match requirement exactly)
// -------------------------
const createIndexes = async (db) => {
  try {
    const productsCollection = db.collection("products");
    await productsCollection.createIndex({ name: 1 });
    await productsCollection.createIndex({ description: 1 });
    await productsCollection.createIndex({ category: 1 });
    await productsCollection.createIndex({ id: 1 });

    const usersCollection = db.collection("users");
    await usersCollection.createIndex({ name: 1 });
    await usersCollection.createIndex({ email: 1 }, { unique: true });

    console.log("Indexes created ✅");
  } catch (error) {
    console.error("createIndexes error:", error.message);
  }
};

// -------------------------
// Main runner
// -------------------------
const init = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(process.env.MONGO_DATABASE);

    await seedProducts(db);
    await seedAlerts(db);
    await seedOrders(db);
    await seedUsers(db);

    await createIndexes(db);

    console.log("Database setup complete ✅");
  } catch (error) {
    console.error("init error:", error.message);
  } finally {
    await client.close();
  }
};

init();
