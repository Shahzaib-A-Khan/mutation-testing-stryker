import { describe, expect, it } from 'vitest';
import { applyPromo, discountRate, orderTotal, shippingCost, subtotal } from '../src/pricing';

describe('pricing (first draft of tests)', () => {
  it('adds up the items', () => {
    expect(subtotal([{ price: 10, quantity: 2 }, { price: 5, quantity: 1 }])).toBe(25);
  });

  it('gives members a discount', () => {
    expect(discountRate('member', 20)).toBeGreaterThan(0);
  });

  it('gives vips a bigger discount', () => {
    expect(discountRate('vip', 20)).toBeGreaterThan(discountRate('member', 20));
  });

  it('adds a bonus for big orders', () => {
    expect(discountRate('regular', 150)).toBeGreaterThan(0);
  });

  it('charges shipping on small orders', () => {
    expect(shippingCost(20, 0.5)).toBeGreaterThan(0);
    expect(shippingCost(20, 3)).toBeGreaterThan(0);
    expect(shippingCost(20, 10)).toBeGreaterThan(0);
  });

  it('ships big orders free', () => {
    expect(shippingCost(80, 2)).toBe(0);
  });

  it('applies a promo code', () => {
    expect(applyPromo(50, 'SAVE10')).toBeLessThan(50);
    expect(applyPromo(50, 'HALF')).toBeLessThan(50);
  });

  it('calculates an order total', () => {
    expect(orderTotal([{ price: 10, quantity: 2 }], 'regular', 1)).toBeGreaterThan(0);
  });
});