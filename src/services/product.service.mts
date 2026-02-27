import type { Filter } from "mongodb";
import productModel from "../models/product.model.mts";
import type { QueryParams, FindProductObj, Product } from "../models/types.mts";
import { formatFields, buildPaginationWrapper } from "./utils.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";

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
    search: search as Record<string, any>,
    limit: query.limit ? parseInt(query.limit, 10) : 20,
    offset: query.offset ? parseInt(query.offset, 10) : 0,
  };

  // Field projection (e.g. fields=name,price)
  if (query.fields) {
    findProduct.fieldFilters = formatFields(query.fields);
  }

  // Get the results from model
  const { totalCount, products } = await productModel.getAllProducts(findProduct);
  
  // Build pagination wrapper
  const paginationWrapper = buildPaginationWrapper(totalCount, query);
  paginationWrapper.results = products;
  
  return paginationWrapper;
}

export async function getProductById(id: string) {
  return await productModel.getProductById(id);
}

export async function searchProducts(query: QueryParams & { query?: string }) {
  const searchTerm = (query.query ?? query.q ?? "").trim();

  if (!searchTerm) {
    throw new EntityNotFoundError({
      message: "Search query is required",
      code: "ERR_VALID",
      statusCode: 400,
    });
  }

  const rx = new RegExp(searchTerm, "i");

  const findProduct: FindProductObj = {
    search: {
      $or: [
        { category: rx },
        { name: rx },
        { descriptionHtmlSimple: rx },
      ],
    } as Record<string, any>,
    limit: query.limit ? parseInt(query.limit, 10) : 20,
    offset: query.offset ? parseInt(query.offset, 10) : 0,
  };

  if (query.fields) {
    findProduct.fieldFilters = formatFields(query.fields);
  }

  const { totalCount, products } = await productModel.getAllProducts(findProduct);

  const paginationWrapper = buildPaginationWrapper(totalCount, query);
  paginationWrapper.results = products;

  return paginationWrapper;
}

export default {
  getAllProducts,
  getProductById,
  searchProducts,
};
