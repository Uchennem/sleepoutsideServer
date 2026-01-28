import productModel from "../models/product.model.mts";


 const getAllProducts = async () => {
  return await productModel.getAllProducts();
};

export default {
  getAllProducts
};