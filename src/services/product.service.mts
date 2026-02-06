import type { Filter } from "mongodb";
import productModel from "../models/product.model.mts";
import type { QueryParams, FindProductObj, Product } from "../models/types.mts";
import { formatFields } from "./utils.mts";

export async function getAllProducts(query: QueryParams) {
  // Build a MongoDB filter that matches your Product type
  const search: Filter<Product> = {};

  // Text search: match either name OR descriptionHtmlSimple
  if (query.q) {
    const rx = new RegExp(query.q, "i");
    search.$or = [{ name: rx }, { descriptionHtmlSimple: rx }];
  }

  // Category filter
  if (query.category) {
    // If Product["category"] is a union (e.g. "tents" | "backpacks" | ...),
    // this cast keeps TS happy without losing runtime behavior.
    search.category = query.category as Product["category"];
  }

  const findProduct: FindProductObj = {
    search,
    limit: query.limit ? parseInt(query.limit, 10) : 20,
    offset: query.offset ? parseInt(query.offset, 10) : 0,
  };

  // Field projection (e.g. fields=name,price)
  if (query.fields) {
    findProduct.fieldFilters = formatFields(query.fields);
  }

  // ✅ fixed typo: findProduct (not findProducts)
  const result = await productModel.getAllProducts(findProduct);
  return result;
}

export async function getProductById(id: string) {
  return await productModel.getProductById(id);
}

export default {
  getAllProducts,
  getProductById,
};
