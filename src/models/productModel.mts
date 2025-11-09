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

export async function getRecommendedProducts(productId: string): Promise<Product[]> {
    const product = await getProductById(productId);
    if (!product) {
        return [];
    }

    const collection = mongodb.getDb().collection<Product>("products");
    const recommended: Product[] = [];
    const excludedIds = new Set<string>([product.id, product._id]);

    // 1. Get one product from the same category (excluding the original)
    const sameCategoryProducts = await collection
        .find({ 
            category: product.category,
            id: { $ne: product.id },
            _id: { $ne: product._id }
        })
        .limit(1)
        .toArray();
    
    if (sameCategoryProducts.length > 0) {
        recommended.push(sameCategoryProducts[0]);
        excludedIds.add(sameCategoryProducts[0].id);
        excludedIds.add(sameCategoryProducts[0]._id);
    }

    // 2. Get one product from a different category (excluding the original and the one we already picked)
    const differentCategoryProducts = await collection
        .find({ 
            category: { $ne: product.category },
            id: { $nin: Array.from(excludedIds) },
            _id: { $nin: Array.from(excludedIds) }
        })
        .limit(1)
        .toArray();
    
    if (differentCategoryProducts.length > 0) {
        recommended.push(differentCategoryProducts[0]);
        excludedIds.add(differentCategoryProducts[0].id);
        excludedIds.add(differentCategoryProducts[0]._id);
    }

    // 3. Get one more product (can be any category, but not duplicates)
    const additionalProducts = await collection
        .find({ 
            id: { $nin: Array.from(excludedIds) },
            _id: { $nin: Array.from(excludedIds) }
        })
        .limit(1)
        .toArray();
    
    if (additionalProducts.length > 0) {
        recommended.push(additionalProducts[0]);
    }

    return recommended;
}