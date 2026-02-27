import { Router } from "express";
import productService from "../services/product.service.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import { sanitize, buildPaginationWrapper } from "../services/utils.mts";
const router: Router = Router();

// GET /products/
router.get("/", async (req, res, next) => {
  try {
    const cleanQuery = sanitize({ ...req.query } as Record<string, any>);
    const result = await productService.getAllProducts(cleanQuery as any);
    
    if (result.count === 0) {
      return next(new EntityNotFoundError({message : 'Products Not Found',code: 'ERR_NF',
      statusCode : 404}))
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// GET /products/search
router.get("/search", async (req, res, next) => {
  try {
    const cleanQuery = sanitize({ ...req.query } as Record<string, any>);
    const result = await productService.searchProducts(cleanQuery as any);

    if (result.count === 0) {
      return next(
        new EntityNotFoundError({
          message: "Products Not Found",
          code: "ERR_NF",
          statusCode: 404,
        })
      );
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// GET /products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return next(new EntityNotFoundError({message: 'Product Not Found', code: 'ERR_NF', statusCode: 404}));
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

export default router; // Export the router to use it in the main file
