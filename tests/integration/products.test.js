// Load environment variables for tests
import "dotenv/config";
import request from "supertest";

// Import test helpers from vitest
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

// Mock the database module so tests don't require a live MongoDB instance.
// The mock implements the minimal API used by the model: `initDb`, `getDb`, and `closeDb`.
vi.mock("../../src/database/index.mts", () => {
  const matchesQuery = (item, query = {}) => {
    if (!query || Object.keys(query).length === 0) {
      return true;
    }

    if (Array.isArray(query.$or)) {
      return query.$or.some((subQuery) => matchesQuery(item, subQuery));
    }

    return Object.entries(query).every(([field, expected]) => {
      const actual = item[field];

      if (expected instanceof RegExp) {
        return typeof actual === "string" && expected.test(actual);
      }

      return actual === expected;
    });
  };

  // in-memory store for collections
  const collections = {
    products: [
      {
        id: "880RR",
        category: "tents",
        nameWithoutBrand: "Ajax Tent - 3-Person, 3-Season",
        name: "Marmot Ajax Tent - 3-Person, 3-Season",
        image:
          "../images/tents/marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320.jpg",

        sizesAvailable: {},
        colors: [
          {
            colorCode: "01",
            colorName: "Pale Pumpkin/Terracotta"
          }
        ],
        descriptionHtmlSimple:
          "Get out and enjoy nature with Marmot&#39;s Ajax tent, featuring a smart design with durable, waterproof construction and two doors for easy access.",
        suggestedRetailPrice: 300.0,
        brand: {
          id: "1308",
          logoSrc: "../images/logos/marmot-160x100.jpg",
          name: "Marmot"
        },
        listPrice: 199.99,
        finalPrice: 199.99
      }
    ]
  };

  return {
    default: {
      initDb: (cb) => cb && cb(null),
      getDb: () => ({
        collection: (name) => ({
          countDocuments: async (query = {}) =>
            (collections[name] || []).filter((item) => matchesQuery(item, query))
              .length,
          find: (query = {}) => {
            let data = [...(collections[name] || [])].filter((item) =>
              matchesQuery(item, query)
            );
            return {
              skip: (offset) => {
                data = data.slice(offset);
                return {
                  limit: (limit) => {
                    data = data.slice(0, limit);
                    return {
                      project: () => ({
                        toArray: async () => data
                      }),
                      toArray: async () => data
                    };
                  }
                };
              }
            };
          },
          deleteMany: async (q) => {
            collections[name] = [];
            return { deletedCount: 0 };
          }
        })
      }),
      closeDb: async () => {
        // noop for mock
      }
    }
  };
});

describe("getAllProducts", () => {
  let mongodb;
  let productsModel;
  let app;

  beforeAll(async () => {
    // Import the mocked DB module and the model after the mock is registered
    mongodb = (await import("../../src/database/index.mts")).default;
    productsModel = (await import("../../src/models/product.model.mts"))
      .default;
    app = (await import("../../src/app.ts")).default;

    // call initDb (mocked)
    await new Promise((resolve, reject) => {
      mongodb.initDb((err) => (err ? reject(err) : resolve(null)));
    });
  });

  afterAll(async () => {
    try {
      await mongodb.closeDb();
    } catch (e) {
      // ignore
    }
  });

  it("should return an array of products", async () => {
    const data = await productsModel.getAllProducts({
      search: {},
      limit: 20,
      offset: 0
    });

    expect(data.totalCount).toBe(1);
    expect(data.products).toHaveLength(1);
    expect(data.products[0].id).toBe("880RR");
  });

  it("should return matching products from /products/search by name", async () => {
    const response = await request(app).get(
      "/api/v1/products/search?query=ajax"
    );

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.results).toHaveLength(1);
    expect(response.body.results[0].id).toBe("880RR");
  });

  it("should return matching products from /products/search by category", async () => {
    const response = await request(app).get(
      "/api/v1/products/search?query=tent"
    );

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.results).toHaveLength(1);
  });

  it("should return 404 when /products/search finds no matches", async () => {
    const response = await request(app).get(
      "/api/v1/products/search?query=nomatch"
    );

    expect(response.status).toBe(404);
  });

  it("should return an empty list if no documents are found in the database", async () => {
    // clear out any existing test data via mocked collection
    const collection = (await import("../../src/database/index.mts")).default
      .getDb()
      .collection("products");
    await collection.deleteMany({});

    const data = await productsModel.getAllProducts({
      search: {},
      limit: 20,
      offset: 0
    });
    expect(data.totalCount).toBe(0);
    expect(data.products).toEqual([]);
  });
});
