export type CustomerType = 'regular' | 'member' | 'vip';

export interface OrderItem {
  price: number;
  quantity: number;
}

export function subtotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function discountRate(customer: CustomerType, orderSubtotal: number): number {
  let rate = 0;
  if (customer === 'member') rate = 0.05;
  if (customer === 'vip') rate = 0.1;
  if (orderSubtotal >= 100) rate += 0.05;
  return rate;
}

export function shippingCost(orderSubtotal: number, weightKg: number): number {
  if (orderSubtotal >= 50) return 0;
  if (weightKg <= 1) return 4.99;
  if (weightKg <= 5) return 8.99;
  return 14.99;
}

export function applyPromo(total: number, code: string | undefined): number {
  if (code === 'SAVE10') return total - 10;
  if (code === 'HALF') return total / 2;
  return total;
}

export function orderTotal(
  items: OrderItem[],
  customer: CustomerType,
  weightKg: number,
  promo?: string,
): number {
  const sub = subtotal(items);
  const discounted = sub * (1 - discountRate(customer, sub));
  const withPromo = Math.max(0, applyPromo(discounted, promo));
  const total = withPromo + shippingCost(sub, weightKg);
  return Math.round(total * 100) / 100;
}