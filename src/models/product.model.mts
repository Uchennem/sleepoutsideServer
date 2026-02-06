import mongodb from "../database/index.mts";
import type { Product, FindProductObj } from "./types.mts";

async function getAllProducts(find: FindProductObj): Promise<Product[]> {
  const cursor = mongodb
    .getDb()
    .collection<Product>("products")
    .find(find.search, {
      projection: find.fieldFilters,
    })
    .skip(find.offset)
    .limit(find.limit);

  return await cursor.toArray();
}

async function getProductById(id: string): Promise<Product | null> {
  return await mongodb.getDb().collection<Product>("products").findOne({ id });
}

export default {
  getAllProducts,
  getProductById,
};
