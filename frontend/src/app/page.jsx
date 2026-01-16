import Link from 'next/link';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Only authentic luxury brands'
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Protected payments & data'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Free shipping over $100'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-luxury-black via-luxury-darkGray to-luxury-black py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-gold mb-6 animate-fade-in">
              Luxury Beauty
              <span className="block text-white mt-2">Refined</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover the world's most prestigious cosmetics and skincare brands, curated for the discerning individual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <button className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2">
                  Shop Now
                  <ArrowRight size={20} />
                </button>
              </Link>
              <Link href="/about">
                <button className="btn-outline px-8 py-4 text-lg">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-luxury-darkGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
                    <Icon size={32} className="text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold-dark via-gold to-gold-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-heading font-bold text-black mb-4">
            Ready to Experience Luxury?
          </h2>
          <p className="text-xl text-black/80 mb-8">
            Browse our curated collection of premium beauty products
          </p>
          <Link href="/products">
            <button className="bg-black hover:bg-luxury-darkGray text-gold font-bold py-4 px-8 rounded-lg transition-colors text-lg">
              Explore Collection
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
