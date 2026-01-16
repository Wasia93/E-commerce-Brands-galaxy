import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-luxury-darkGray border-t border-gold/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-heading text-gold font-bold mb-4">
              Brands Galaxy
            </h3>
            <p className="text-gray-400 text-sm">
              Premium luxury cosmetics and skincare from the world's finest brands.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-400 hover:text-gold transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-gold transition-colors">Categories</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-gold transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-gold font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-400 hover:text-gold transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-gold transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-gold transition-colors">Returns</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-gold font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Brands Galaxy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
