// Import necessary modules
import { describe, it, expect, vi } from "vitest";
import productsController from "../src/controllers/products.mjs"; // Adjust the import based on your file structure

// Mock the global fetch function
global.fetch = vi.fn();

describe("getTents", () => {
  it("should fetch tents and return them as JSON", async () => {
    // Mock the response from fetch
    const mockTents = [
      { id: 1, name: "Tent 1", price: 100 },
      { id: 2, name: "Tent 2", price: 200 }
    ];

    fetch.mockResolvedValueOnce({
      json: async () => mockTents // Mock the json method
    });

    // Mock request and response objects
    const req = {}; // You can add properties to req if needed
    const res = {
      json: vi.fn() // Mock the json method
    };
    const next = vi.fn(); // Mock the next function

    // Call the getTents function
    await productsController.getTents(req, res, next);

    // Check that fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/tents.json");

    // Check that res.json was called with the correct data
    expect(res.json).toHaveBeenCalledWith(mockTents);
  });
});
