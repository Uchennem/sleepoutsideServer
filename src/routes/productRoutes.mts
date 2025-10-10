import { Router } from 'express';
import { getAllProducts, getProductById } from '../models/productModel.mts';
import EntityNotFoundError from '../errors/EntityNotFoundError.mts';
import type { Request, Response } from 'express';
import * as utils from '../services/utils.mts';
const router: Router = Router();

// GET /products/
router.get('/', async (req, res, next) => {
  const query = utils.sanitize(req.query);
  console.log(query);

  const products = await getAllProducts(query);

  if (!products.totalCount) {
    // This is an example you can refer to about how to handle errors in our routes
    // If you check the middleware folder you will see a general error handler that will get called automatically when we throw like this
    throw new EntityNotFoundError(
      {message : 'Products Not Found', code: 'ERR_NF', statusCode : 404}
    )
  }

  res.status(200).json(
    utils.buildPaginationWrapper(products.totalCount, query, products.data)
  );
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
