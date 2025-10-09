import { Router } from 'express';
import { getAllProducts, getProductById } from '../models/productModel.mts';
import EntityNotFoundError from '../errors/EntityNotFoundError.mts';
import type { Request, Response } from 'express';
import type { QueryParams } from '../models/types.mts';
const router: Router = Router();

// GET /products/
router.get('/', async (req, res, next) => {
  const query = req.query as QueryParams;
  console.log(query);

  const products = (Object.keys(query).length === 0) ?
    // if no search query is given
    await getAllProducts()
  :
    // if search query is given
    await (()=>{

      // create the filter
      const filter = {};
      if (query.q) {
        filter.$or =  [
          { name: { $regex: query.q, $options: 'i' } },
          { descriptionHtmlSimple: { $regex: query.q, $options: 'i' } },
        ];
      }
      if (query.category) {
        filter.category = query.category;
      }

      if (query.fields && !Array.isArray(query.fields)) query.fields = [query.fields];
      
      let limit = query.limit ? parseInt(query.limit) : Infinity,
          offset = query.offset ? parseInt(query.offset) : 0,
          fields = query.fields ? query.fields.reduce((acc, field) => ({...acc, [field] : 1}), {}) : {};
      console.log(fields);
      
      return getAllProducts(filter, {}, fields, limit, offset);
    })();

  if (!products?.length) {
    // This is an example you can refer to about how to handle errors in our routes
    // If you check the middleware folder you will see a general error handler that will get called automatically when we throw like this
   throw new EntityNotFoundError({message : 'Products Not Found',code: 'ERR_NF',
    statusCode : 404})
  }

  res.status(200).json({
      "count": products.length,
      "next": null,
      "previous": null,
      "results": products
  });
});

// GET /products/:id
router.get('/:id', async (req:Request, res:Response) => {
  
    const {id} = req.params;
    if (!id)  {
      throw new EntityNotFoundError({message : 'Id required',code: 'ERR_VALID', statusCode : 400})
    }
    const product = await getProductById(id);
    if (!product) {
      throw new EntityNotFoundError({message : `Product ${id} Not Found`,code: 'ERR_NF',
        statusCode : 404})
    }
    res.status(200).json(product);
  
});

export default router; // Export the router to use it in the main file
