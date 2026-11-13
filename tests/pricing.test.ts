import { describe, expect, it } from 'vitest';
import { applyPromo, discountRate, orderTotal, shippingCost, subtotal } from '../src/pricing';

describe('subtotal', () => {
  it('adds up price times quantity', () => {
    expect(subtotal([{ price: 10, quantity: 2 }, { price: 5, quantity: 1 }])).toBe(25);
  });

  it('is zero for an empty order', () => {
    expect(subtotal([])).toBe(0);
  });
});

describe('discountRate', () => {
  it('gives each customer type its own rate on a small order', () => {
    expect(discountRate('regular', 20)).toBeCloseTo(0);
    expect(discountRate('member', 20)).toBeCloseTo(0.05);
    expect(discountRate('vip', 20)).toBeCloseTo(0.1);
  });

  it('adds 5 points at exactly 100 and not just below', () => {
    expect(discountRate('regular', 99.99)).toBeCloseTo(0);
    expect(discountRate('regular', 100)).toBeCloseTo(0.05);
    expect(discountRate('member', 100)).toBeCloseTo(0.1);
    expect(discountRate('vip', 100)).toBeCloseTo(0.15);
  });
});

describe('shippingCost', () => {
  it('is free from 50 upwards and not just below', () => {
    expect(shippingCost(49.99, 1)).toBe(4.99);
    expect(shippingCost(50, 1)).toBe(0);
    expect(shippingCost(80, 10)).toBe(0);
  });

  it('charges by weight band, including the band edges', () => {
    expect(shippingCost(20, 0.5)).toBe(4.99);
    expect(shippingCost(20, 1)).toBe(4.99);
    expect(shippingCost(20, 1.01)).toBe(8.99);
    expect(shippingCost(20, 5)).toBe(8.99);
    expect(shippingCost(20, 5.01)).toBe(14.99);
  });
});

describe('applyPromo', () => {
  it('applies the known codes exactly', () => {
    expect(applyPromo(50, 'SAVE10')).toBe(40);
    expect(applyPromo(50, 'HALF')).toBe(25);
  });

  it('ignores missing and unknown codes', () => {
    expect(applyPromo(50, undefined)).toBe(50);
    expect(applyPromo(50, 'OTHER')).toBe(50);
    expect(applyPromo(50, 'save10')).toBe(50);
  });
});

describe('orderTotal', () => {
  it('adds shipping to a regular customer order', () => {
    expect(orderTotal([{ price: 10, quantity: 2 }], 'regular', 1)).toBe(24.99);
  });

  it('is just the shipping for an empty order', () => {
    expect(orderTotal([], 'regular', 1)).toBe(4.99);
  });

  it('applies the vip discount and free shipping on a 100 order', () => {
    expect(orderTotal([{ price: 50, quantity: 2 }], 'vip', 1)).toBe(85);
  });

  it('applies a promo after the discount', () => {
    expect(orderTotal([{ price: 50, quantity: 2 }], 'vip', 1, 'SAVE10')).toBe(75);
    expect(orderTotal([{ price: 20, quantity: 2 }], 'member', 3, 'HALF')).toBe(27.99);
  });

  it('never lets a promo push the goods total below zero', () => {
    expect(orderTotal([{ price: 5, quantity: 1 }], 'regular', 1, 'SAVE10')).toBe(4.99);
  });

  it('rounds to two decimals', () => {
    expect(orderTotal([{ price: 0.1, quantity: 3 }], 'regular', 1)).toBe(5.29);
  });
});