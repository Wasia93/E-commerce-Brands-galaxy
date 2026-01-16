'use client';

import { useCartStore } from '@/lib/store';
import { Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import Button from '@/components/common/Button';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);

  const total = getTotal();
  const shipping = total >= 100 ? 0 : 10;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gold mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Add some products to get started</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-heading font-bold text-gold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-luxury-darkGray border border-gold/20 rounded-lg p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.images?.[0] || '/images/placeholder-product.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{item.name}</h3>
                        <p className="text-gold-dark text-sm">{item.brand}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-luxury-lightGray hover:bg-luxury-black p-2 rounded"
                        >
                          <Minus size={16} className="text-gold" />
                        </button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-luxury-lightGray hover:bg-luxury-black p-2 rounded"
                        >
                          <Plus size={16} className="text-gold" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-gold font-bold text-lg">
                          {formatCurrency((item.discount_price || item.price) * item.quantity)}
                        </p>
                        {item.discount_price && (
                          <p className="text-gray-500 line-through text-sm">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-luxury-darkGray border border-gold/20 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-white">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Tax (8%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-gold/20 pt-3">
                  <div className="flex justify-between text-gold font-bold text-xl">
                    <span>Total</span>
                    <span>{formatCurrency(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {total < 100 && (
                <p className="text-sm text-gray-400 mb-4">
                  Add {formatCurrency(100 - total)} more for free shipping!
                </p>
              )}

              <Link href="/checkout">
                <Button className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/products">
                <button className="w-full mt-3 text-gold hover:text-gold-light transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
