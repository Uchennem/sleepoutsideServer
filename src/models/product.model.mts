import mongodb from "../database/index.mts";
import type {Product} from "./types.mts";


async function getAllProducts(): Promise<Product[] | null> {
    const data = (await mongodb.getDb().collection<Product>("products").find({}).toArray());
    console.log(data)
    return data ;
}

async function getProductById(id: string): Promise<Product | null> {
    const data = await mongodb.getDb().collection<Product>("products").findOne({ id: id });
    return data;
}

export default {
    getAllProducts,
    getProductById
};


