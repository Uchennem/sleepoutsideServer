import "dotenv/config";
import request from "supertest";
import { describe, it, expect, beforeAll, vi } from "vitest";

vi.mock("../../src/database/index.mts", () => {
  const users = [];

  return {
    default: {
      initDb: (cb) => cb && cb(null),
      getDb: () => ({
        collection: (name) => {
          if (name !== "users") {
            return {
              findOne: async () => null,
              insertOne: async () => ({ insertedId: "ignored" })
            };
          }

          return {
            findOne: async (query) => {
              if (query?.email) {
                return users.find((user) => user.email === query.email) || null;
              }
              return null;
            },
            insertOne: async (doc) => {
              const insertedId = String(users.length + 1);
              users.push({ ...doc, _id: insertedId });
              return { insertedId };
            }
          };
        }
      }),
      closeDb: async () => {}
    }
  };
});

describe("users auth routes", () => {
  let app;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
    process.env.JWT_EXPIRES_IN = "300s";

    app = (await import("../../src/app.ts")).default;
  });

  it("registers a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users/")
      .send({
        email: "newuser@test.com",
        password: "123456",
        name: "New User"
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully.");
    expect(response.body.user.email).toBe("newuser@test.com");
    expect(response.body.user).toHaveProperty("_id");
  });

  it("logs in and returns token and user", async () => {
    await request(app).post("/api/v1/users/").send({
      email: "loginuser@test.com",
      password: "123456",
      name: "Login User"
    });

    const response = await request(app)
      .post("/api/v1/users/login")
      .send({ email: "loginuser@test.com", password: "123456" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe("loginuser@test.com");
  });

  it("blocks protected route without token", async () => {
    const response = await request(app).get("/api/v1/users/protected");

    expect(response.status).toBe(401);
  });

  it("allows protected route with bearer token", async () => {
    await request(app).post("/api/v1/users/").send({
      email: "protected@test.com",
      password: "123456",
      name: "Protected User"
    });

    const loginResponse = await request(app)
      .post("/api/v1/users/login")
      .send({ email: "protected@test.com", password: "123456" });

    const token = loginResponse.body.token;

    const protectedResponse = await request(app)
      .get("/api/v1/users/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(protectedResponse.status).toBe(200);
    expect(protectedResponse.body.message).toContain("protected@test.com");
  });
});
