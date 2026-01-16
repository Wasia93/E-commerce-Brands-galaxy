import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-luxury-darkGray aspect-square rounded-lg" />
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-luxury-darkGray rounded w-3/4" />
              <div className="h-4 bg-luxury-darkGray rounded w-1/2" />
              <div className="h-6 bg-luxury-darkGray rounded w-1/3 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-xl">No products found</p>
        <a href="/products" className="text-gold hover:underline mt-4 inline-block">
          Browse all products
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
