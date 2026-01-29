// =====================
// Alert Schema
// =====================
export const alertSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://example.com/schemas/alert.json",
  title: "Alert",
  type: "object",
  additionalProperties: false,
  required: ["_id", "title", "type", "status", "createdAt", "modifiedAt"],
  properties: {
    _id: { type: "string" },
    title: {
      type: "string",
      minLength: 1,
      description: "The title of the alert, must not be blank"
    },
    type: {
      type: "string",
      enum: ["warning", "info", "promotion"]
    },
    status: {
      type: "string",
      enum: ["active", "inactive"]
    },
    createdAt: { type: "string", format: "date-time" },
    modifiedAt: { type: "string", format: "date-time" }
  }
};

// =====================
// Product Schema
// =====================
// schemas/product.mjs
export const productSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://example.com/schemas/product.json",
  title: "Product",
  type: "object",
  additionalProperties: false,
  required: [
    "_id",
    "id",
    "isClearance",
    "category",
    "isNew",
    "url",
    "reviews",
    "nameWithoutBrand",
    "name",
    "images",
    "sizesAvailable",
    "colors",
    "descriptionHtmlSimple",
    "suggestedRetailPrice",
    "brand",
    "listPrice",
    "finalPrice"
  ],
  properties: {
    _id: { type: "string" },
    id: { type: "string", minLength: 1 },
    isClearance: { type: "boolean" },
    category: { type: "string", minLength: 1 },
    isNew: { type: "boolean" },
    url: { type: "string", minLength: 1 },

    reviews: {
      type: "object",
      additionalProperties: false,
      required: ["reviewsUrl", "reviewCount", "averageRating"],
      properties: {
        reviewsUrl: { type: "string", minLength: 1 },
        reviewCount: { type: "number", minimum: 0 },
        averageRating: { type: "number", minimum: 0, maximum: 5 }
      }
    },

    nameWithoutBrand: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1 },

    images: {
      type: "object",
      additionalProperties: false,
      required: ["primarySmall", "primaryMedium", "primaryLarge", "primaryExtraLarge", "extraImages"],
      properties: {
        primarySmall: { type: "string", minLength: 1 },
        primaryMedium: { type: "string", minLength: 1 },
        primaryLarge: { type: "string", minLength: 1 },
        primaryExtraLarge: { type: "string", minLength: 1 },
        extraImages: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["title", "src"],
            properties: {
              title: { type: "string", minLength: 1 },
              src: { type: "string", minLength: 1 }
            }
          }
        }
      }
    },

    sizesAvailable: {
      type: "object",
      additionalProperties: false,
      required: ["zipper"],
      properties: {
        zipper: { type: "array", items: { type: "string" } }
      }
    },

    colors: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["colorCode", "colorName", "colorChipImageSrc", "colorPreviewImageSrc"],
        properties: {
          colorCode: { type: "string", minLength: 1 },
          colorName: { type: "string", minLength: 1 },
          colorChipImageSrc: { type: "string", minLength: 1 },
          colorPreviewImageSrc: { type: "string", minLength: 1 }
        }
      }
    },

    descriptionHtmlSimple: { type: "string" },
    suggestedRetailPrice: { type: "number", minimum: 0 },

    brand: {
      type: "object",
      additionalProperties: false,
      required: ["id", "url", "productsUrl", "logoSrc", "name"],
      properties: {
        id: { type: "string", minLength: 1 },
        url: { type: "string", minLength: 1 },
        productsUrl: { type: "string", minLength: 1 },
        logoSrc: { type: "string", minLength: 1 },
        name: { type: "string", minLength: 1 }
      }
    },

    listPrice: { type: "number", minimum: 0 },
    finalPrice: { type: "number", minimum: 0 }
  }
};

// =====================
// Reviews Schema
// =====================
export const reviewsSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://example.com/schemas/reviews.json",
  title: "Reviews",
  type: "object",
  additionalProperties: false,
  required: ["_id", "product_id", "content"],
  properties: {
    _id: { type: "string" },
    product_id: { type: "string" },
    content: {
      type: "array",
      items: { type: "string" },
      description: "List of review texts"
    }
  }
};

// =====================
// Cart Schema
// =====================
export const cartSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://example.com/schemas/cart.json",
  title: "Cart",
  type: "object",
  additionalProperties: false,
  required: ["_id", "user_id", "items"],
  properties: {
    _id: { type: "string" },
    user_id: { type: "string" },
    items: {
      type: "array",
      items: { type: "string" },
      description: "List of product ids"
    }
  }
};

// =====================
// Order Schema
// =====================
export const orderSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://example.com/schemas/order.json",
  title: "Order",
  type: "object",
  additionalProperties: false,
  required: ["_id", "user_id", "status", "shipping_address", "items", "total", "createdAt"],
  properties: {
    _id: { type: "string" },
    user_id: { type: "string" },

    status: {
      type: "object",
      additionalProperties: false,
      required: ["isPaid", "isShipped"],
      properties: {
        isPaid: { type: "boolean" },
        isShipped: { type: "boolean" }
      }
    },

    shipping_address: {
      type: "string",
      minLength: 1
    },

    items: {
      type: "array",
      items: { type: "string" },
      minItems: 1
    },

    total: { type: "number" },
    createdAt: { type: "string", format: "date-time" }
  }
};

// =====================
// User Schema
// =====================
export const userSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://example.com/schemas/user.json",
  title: "User",
  type: "object",
  additionalProperties: false,
  required: ["_id", "name", "email", "hashedPassword", "role"],
  properties: {
    _id: { type: "string" },

    name: {
      type: "object",
      additionalProperties: false,
      required: ["firstName", "lastName"],
      properties: {
        firstName: { type: "string", minLength: 1 },
        lastName: { type: "string", minLength: 1 }
      }
    },

    email: {
      type: "string",
      format: "email"
    },

    hashedPassword: {
      type: "string",
      minLength: 1
    },

    role: {
      type: "object",
      additionalProperties: false,
      required: ["isCustomer", "isAdmin"],
      properties: {
        isCustomer: { type: "boolean" },
        isAdmin: { type: "boolean" }
      }
    }
  }
};
