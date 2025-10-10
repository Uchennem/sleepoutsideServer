import mongodb from "../database/index.mts";
import type {Find, QueryParams, Product} from "./types.mts";
import * as utils from "../services/utils.mts";


export async function getAllProducts(query:QueryParams = {}): Promise<{totalCount: number; data: Product[] | null}> {
    // if query is empty, just return all products
    if (Object.keys(query).length === 0) {
        const products = await mongodb.getDb().collection<Product>("products").find().toArray();
        return {totalCount: products.length, data: products};
    }

    // setupt the cursor
    const cursor = await mongodb.getDb().collection<Product>("products");

    // create the filter
    const filter = {} as Find;
    if (query.q)
        filter.$or =  [
            { name: { $regex: query.q, $options: 'i' } },
            { descriptionHtmlSimple: { $regex: query.q, $options: 'i' } },
        ];
    if (query.category) filter.category = query.category;
    
    const totalCount = await cursor.countDocuments(filter as any);
    let results = await cursor.find(filter as any);
    
    if (query.limit) results = results.limit(parseInt(query.limit));
    if (query.offset) results = results.skip(parseInt(query.offset));
    if (query.fields) results = results.project(utils.formatFields(query.fields));

    return {
        totalCount: totalCount,
        data: (await results.toArray()) as Product[] | null
    };
}

export async function getProductById(id: string): Promise<Product | null> {
    const product = await mongodb.getDb().collection<Product>("products").findOne({id: id});
    return product;
}
