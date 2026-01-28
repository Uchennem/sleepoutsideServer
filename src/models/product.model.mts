import mongodb from "../database/index.mts";
import type {Product} from "./types.mts";


async function getAllProducts(): Promise<Product[] | null> {
    const data = (await mongodb.getDb().collection<Product>("products").find({}).toArray());
    console.log(data)
    return data ;
}


export default {
    getAllProducts
};


