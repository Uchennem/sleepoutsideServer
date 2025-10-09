import mongodb from "../database/index.mts";
import type {Product} from "./types.mts";


export async function getAllProducts(filter={}, sort={}, projection={}, limit=Infinity, offset=0): Promise<Product[] | null> {
    return (await mongodb.getDb().collection<Product>("products")
        .find(filter)
        .sort(sort)
        .project(projection)
        .skip(offset)
        .limit(limit)
        .toArray()
    ) as Product[] | null;
}

export async function getProductById(id: string): Promise<Product | null> {
    const product = await mongodb.getDb().collection<Product>("products").findOne({id: id});
    return product;
}
