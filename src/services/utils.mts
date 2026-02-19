import type { QueryParams } from "../models/types.mts";
import jwt from "jsonwebtoken";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import addKeywords from "ajv-keywords";
import type { JSONSchema7 } from "json-schema";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";

 

export function formatFields(fields: string) {

  return fields.split(",").reduce((acc, field) => {

    acc[field.trim()] = 1;

    return acc;

  }, {} as Record<string, 1>);

}

 

export function buildPaginationWrapper(totalCount: number, query: QueryParams) {

  const limit = query.limit ? parseInt(query.limit) : 20;

  const offset = query.offset ? parseInt(query.offset) : 0;

 

  const totalPages = Math.ceil(totalCount / limit);

  const currentPage = Math.ceil(offset / limit) + 1;

  const hasPreviousPage = currentPage > 1;

  const hasNextPage = currentPage < totalPages;

 

  let next, prev;

  const params = new URLSearchParams(query as Record<string, any>);

 

  if (hasPreviousPage) {

    params.set("offset", (offset - limit).toString());

    prev = `/?${params}`;

  }

  if (hasNextPage) {

    params.set("offset", (offset + limit).toString());

    next = `/?${params}`;

  }

 

  return {

    count: totalCount,

    prev: prev || null,

    next: next || null,

    results: [] as any,

  };

}

export function sanitize(v: Record<string, any>): Record<string, any> {
  if (typeof v === "object" && v !== null) {
    for (const key in v) {
      if (/^\$/.test(key)) {
        delete v[key];
      } else if (typeof v[key] === "object") {
        sanitize(v[key]);
      }
    }
  }
  return v;
}

export function generateToken(user: { _id: string; email: string }): string {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "300s";

  if (!jwtSecret) {
    throw new EntityNotFoundError({
      message: "JWT secret is not configured.",
      statusCode: 500,
    });
  }

  return jwt.sign(user, jwtSecret, {
    expiresIn: jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function validator(schema: JSONSchema7, data: object) {
  // @ts-ignore
  const ajv = new Ajv();
  // @ts-ignore
  addFormats(ajv);
  // @ts-ignore
  addKeywords(ajv, "instanceof");

  const validate = ajv.compile(schema);

  if (!validate(data) && validate.errors) {
    const message = validate.errors
      .map((error: any) => `${error.instancePath} ${error.message}`)
      .join(", ");

    throw new EntityNotFoundError({ message, statusCode: 400, code: "ERR_VALID" });
  }
}

