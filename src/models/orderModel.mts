import { getProductById } from './productModel.mts';

export function createOrder() {
    
}

// orderItems: list.map(item => ({
//     productId: item._id,
//     price: item.finalPrice,
//     quantity: item.quantity
// }))

// calculate functions based off of what the server says
// Calculate prices using server data 
export async function calculateServerPricedOrder(list: Array<{ productId: string; quantity: number }>): Promise<{
  orderItems: Array<{ productId: string; price: number; quantity: number }>;
  subtotal: number;
  missingProductIds: string[];
}> {
  const orderItems: Array<{ productId: string; price: number; quantity: number }> = [];
  const missingProductIds: string[] = [];

  for (const item of list) {
    const product = await getProductById(item.productId);
    if (!product) {
      missingProductIds.push(item.productId);
      continue;
    }
    orderItems.push({
      productId: item.productId,
      price: product.finalPrice,
      quantity: item.quantity ?? 1,
    });
  }

  const subtotal = orderItems.reduce((sum, oi) => sum + oi.price * oi.quantity, 0);

  return { orderItems, subtotal, missingProductIds };
}



