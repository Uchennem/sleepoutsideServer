import type { JSONSchema7 } from "json-schema";

declare module "json-schema" {
  export interface JSONSchema7 {
    instanceof?: string | string[];
  }
}

// Product schema
export const ProductSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Product",
  description: "",
  type: "object",
  properties: {
    _id: { type: "string" },
    id: { type: "string" },
    isClearance: { type: "boolean" },
    category: {
      type: "string",
      enum: ["tents", "backpacks", "sleeping-bags", "hammocks"],
      description:
        "category of the product, should not be blank and should be either tents, backpacks, sleeping-bags or hammocks"
    },
    isNew: { type: "boolean" },
    url: { type: "string" },
    reviews: {
      type: "object",
      properties: {
        reviewsUrl: { type: "string" },
        reviewCount: { type: "number" },
        averageRating: { type: "number" }
      }
    },
    nameWithoutBrand: {
      type: "string",
      description:
        "name of the product without the brand, should be a string and cannot be blank"
    },
    name: {
      type: "string",
      description:
        "name of the product, including the brand, should be a string and cannot be blank"
    },
    images: {
      type: "object",
      properties: {
        primarySmall: { type: "string" },
        primaryMedium: { type: "string" },
        primaryLarge: { type: "string" },
        primaryExtraLarge: { type: "string" },
        extraImages: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              src: { type: "string" }
            }
          }
        }
      }
    },
    sizesAvailable: {
      type: "object",
      properties: {
        zipper: { type: "array", items: { type: "string" } },
        size: { type: "array", items: { type: "string" } }
      }
    },
    colors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          colorCode: { type: "string" },
          colorName: { type: "string" },
          colorChipImageSrc: { type: "string" },
          colorPreviewImageSrc: { type: "string" }
        }
      }
    },
    descriptionHtmlSimple: {
      type: "string",
      description:
        "descriptionHtmlSimple provides a detailed description of the product as a string and cannot be blank"
    },
    suggestedRetailPrice: {
      type: "number",
      description: "Suggested Price from the manufacturer."
    },
    brand: {
      type: "object",
      properties: {
        id: { type: "string" },
        url: { type: "string" },
        productsUrl: { type: "string" },
        logoSrc: { type: "string" },
        name: { type: "string" }
      }
    },
    listPrice: {
      type: "number",
      description: "List Price from the manufacturer."
    },
    finalPrice: {
      type: "number",
      description:
        "Final Price of the product after any discounts or promotions have been applied. This should be a number and cannot be blank"
    }
  },
  required: [
    "id",
    "category",
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
  ]
};

// User schema
export const UserSchema: JSONSchema7 = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "User",
  description: "",
  type: "object",
  properties: {
    _id: { type: "string" },
    email: { type: "string", format: "email" },
    password: {
      type: "string",
      minLength: 6,
      maxLength: 100,
      description:
        "The password of the user, must be at least six characters long and no more than one hundred characters long"
    },
    name: {
      type: "string",
      minLength: 2,
      maxLength: 50,
      description:
        "The name of the user, must be at least two characters long and no more than 50 characters long"
    },
    address: {
      type: "object",
      properties: {
        street: {
          type: "string",
          minLength: 5,
          maxLength: 100,
          description:
            "The street address of the user, must not be blank and must be at least ten characters long and no more than one hundred characters long"
        },
        city: {
          type: "string",
          minLength: 3,
          maxLength: 50,
          description:
            "The city of the user, must not be blank and must be at least five characters long and no more than fifty characters long"
        },
        state: {
          type: "string",
          enum: [
            "AL",
            "AK",
            "AZ",
            "AR",
            "CA",
            "CO",
            "CT",
            "DE",
            "DC",
            "FL",
            "GA",
            "HI",
            "ID",
            "IL",
            "IN",
            "IA",
            "KS",
            "KY",
            "LA",
            "ME",
            "MD",
            "MA",
            "MI",
            "MN",
            "MS",
            "MO",
            "MT",
            "NE",
            "NV",
            "NH",
            "NJ",
            "NM",
            "NY",
            "NC",
            "ND",
            "OH",
            "OK",
            "OR",
            "PA",
            "RI",
            "SC",
            "SD",
            "TN",
            "TX",
            "UT",
            "VT",
            "VA",
            "WA",
            "WV",
            "WI",
            "WY"
          ],
          description:
            "The state of the user, must not be blank and must be one of the following states: AL, AK, AZ, AR, CA, CO, CT, DE, DC, FL, GA, HI, ID, IL, IN, IA, KS, KY, LA, ME, MD, MA, MI, MN, MS, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VT, VA, WA, WV, WI, WY"
        },
        zipCode: {
          type: "string",
          minLength: 5,
          maxLength: 10,
          pattern: "^\\d{5}(-\\d{4})?$",
          description:
            "The zip code of the user, must not be blank and must be a valid zip code"
        },
        country: {
          type: "string",
          minLength: 2,
          maxLength: 30,
          pattern: "^\\w+$",
          description:
            "The country of the user, must not be blank and must be a valid country"
        }
      }
    },
    phoneNumbers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          number: { type: "string" }
        }
      }
    },
    cart: {
      type: "array",
      items: {
        type: "object",
        properties: {
          productId: { type: "string" },
          productName: { type: "string" },
          price: { type: "number" },
          finalPrice: { type: "number" },
          productImageSrc: { type: "string" },
          productUrl: { type: "string" },
          productCategory: { type: "string" },
          productColor: {
            type: "object",
            properties: {
              colorCode: { type: "string" }
            }
          },
          productSize: { type: "string" }
        }
      }
    },
    createdAt: { instanceof: "Date" },
    modifiedAt: { instanceof: "Date" }
  },
  required: ["email", "password", "name", "createdAt", "modifiedAt"]
};

// Order schema
export const OrderSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Order",
  description: "",
  type: "object",
  properties: {
    _id: { type: "string" },
    userId: { type: "string" },
    status: {
      type: "string",
      enum: ["pending", "processing", "shipped", "delivered"],
      description:
        "The status of the order, must be one of: pending, processing, shipped or delivered"
    },
    cardNumber: { type: "string", minLength: 16, maxLength: 16 },
    cardExpiration: { type: "string" },
    cardCode: { type: "number", minLength: 3, maxLength: 3 },
    shippingAddress: {
      type: "object",
      properties: {
        street: {
          type: "string",
          minLength: 10,
          maxLength: 100,
          description:
            "The street address of the user, must not be blank and must be at least ten characters long and no more than one hundred characters long"
        },
        city: {
          type: "string",
          minLength: 5,
          maxLength: 50,
          description:
            "The city of the user, must not be blank and must be at least five characters long and no more than fifty characters long"
        },
        state: {
          type: "string",
          enum: [
            "AL",
            "AK",
            "AZ",
            "AR",
            "CA",
            "CO",
            "CT",
            "DE",
            "DC",
            "FL",
            "GA",
            "HI",
            "ID",
            "IL",
            "IN",
            "IA",
            "KS",
            "KY",
            "LA",
            "ME",
            "MD",
            "MA",
            "MI",
            "MN",
            "MS",
            "MO",
            "MT",
            "NE",
            "NV",
            "NH",
            "NJ",
            "NM",
            "NY",
            "NC",
            "ND",
            "OH",
            "OK",
            "OR",
            "PA",
            "RI",
            "SC",
            "SD",
            "TN",
            "TX",
            "UT",
            "VT",
            "VA",
            "WA",
            "WV",
            "WI",
            "WY"
          ],
          description:
            "The state of the user, must not be blank and must be one of the following states: AL, AK, AZ, AR, CA, CO, CT, DE, DC, FL, GA, HI, ID, IL, IN, IA, KS, KY, LA, ME, MD, MA, MI, MN, MS, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VT, VA, WA, WV, WI, WY"
        },
        zipCode: {
          type: "string",
          minLength: 5,
          maxLength: 10,
          pattern: "^\\d{5}(-\\d{4})?$",
          description:
            "The zip code of the user, must not be blank and must be a valid zip code"
        },
        country: {
          type: "string",
          minLength: 2,
          maxLength: 30,
          pattern: "^\\w+$",
          description:
            "The country of the user, must not be blank and must be a valid country"
        }
      }
    },
    orderItems: {
      type: "array",
      items: {
        type: "object",
        properties: {
          productId: { type: "string" },
          productName: { type: "string" },
          price: { type: "number" },
          finalPrice: { type: "number" },
          productImageSrc: { type: "string" },
          productUrl: { type: "string" },
          productCategory: { type: "string" },
          productColor: {
            type: "object",
            properties: {
              colorCode: { type: "string" }
            }
          },
          productSize: { type: "string" }
        }
      }
    },
    createdAt: { instanceof: "Date" },
    modifiedAt: { instanceof: "Date" },
    totalPrice: {
      type: "number",
      description: "The total price of the order, must be a number"
    },
    shippingCost: {
      type: "number",
      description: "The shipping cost of the order, must be a number"
    },
    taxAmount: {
      type: "number",
      description: "The tax amount of the order, must be a number"
    }
  },
  required: [
    "userId",
    "status",
    "paymentMethod",
    "shippingAddress",
    "orderItems",
    "createdAt",
    "modifiedAt",
    "totalPrice",
    "shippingCost",
    "taxAmount"
  ]
};

// Alert schema
export const AlertSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Alert",
  description: "",
  type: "object",
  properties: {
    _id: { type: "string" },
    title: { type: "string" },
    type: {
      type: "string",
      enum: ["warning", "info", "promotion"],
      description:
        "The type of the alert, must be one of: warning, info or promotion"
    },
    status: {
      type: "string",
      enum: ["active", "inactive"],
      description: "The status of the alert, must be one of: active or inactive"
    },
    createdAt: { instanceof: "Date" },
    modifiedAt: { instanceof: "Date" }
  },
  required: ["title", "type", "status", "createdAt", "modifiedAt"]
};
