'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { formatCurrency, calculateDiscountPercent } from '@/lib/utils';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success('Added to cart!');
  };

  const displayPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercent = hasDiscount ? calculateDiscountPercent(product.price, product.discount_price) : 0;

  return (
    <Link href={`/products/${product.slug || product.id}`}>
      <div className="bg-luxury-black border border-gold/20 hover:border-gold transition-all duration-300 rounded-lg overflow-hidden group">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-luxury-darkGray">
          <Image
            src={product.images?.[0] || '/images/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badges */}
          {hasDiscount && (
            <span className="absolute top-2 right-2 bg-gold text-black px-3 py-1 rounded-full text-sm font-bold">
              -{discountPercent}%
            </span>
          )}

          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-white text-xl font-bold">OUT OF STOCK</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="bg-white/90 hover:bg-white p-2 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.success('Added to wishlist!');
              }}
            >
              <Heart size={18} className="text-black" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-gold-dark text-xs uppercase tracking-wider font-semibold">
            {product.brand}
          </p>
          <h3 className="text-white font-semibold mt-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gold text-xl font-bold">
              {formatCurrency(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-gray-500 line-through text-sm">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="w-full mt-4 bg-gold hover:bg-gold-dark text-black font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
