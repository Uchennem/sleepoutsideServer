import { getProductById } from './productModel.mts';

export function createOrder() {
    
}



export const calculateShippingCost = function (orderItems: Array<{ productId: string; quantity: number }>) {
    const itemTotal = orderItems.reduce((total, item) => total + item.quantity, 0);
    if (itemTotal < 1)
        return 0;
    // $10 for first item, $2 for each additional
    return (itemTotal - 1) * 2 + 10;
};

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



