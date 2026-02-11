import mongodb from "../database/index.mts";
import type { Product, FindProductObj } from "./types.mts";
import type { Filter } from "mongodb";

async function getAllProducts(find: FindProductObj) {
  const collection = mongodb.getDb().collection<Product>("products");
  const totalCount = await collection.countDocuments(find.search as Filter<Product>);
  
  const cursor = collection
    .find(find.search as Filter<Product>)
    .skip(find.offset)
    .limit(find.limit);

  if (find.fieldFilters) {
    cursor.project(find.fieldFilters);
  }

  const products = await cursor.toArray();

  return { totalCount, products };
}

async function getProductById(id: string): Promise<Product | null> {
  return await mongodb.getDb().collection<Product>("products").findOne({ id });
}

export default {
  getAllProducts,
  getProductById,
};
