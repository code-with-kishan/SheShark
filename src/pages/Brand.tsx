import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import { GlassCard } from '@/components/UI';
import { marketplaceService } from '@/services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  modelUrl?: string;
  brand?: string;
  images: string[];
  rating: number;
  seller: { id: string; name: string };
  inStock: boolean;
}

const Brand = () => {
  const { brand = '' } = useParams();
  const decodedBrand = decodeURIComponent(brand);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    marketplaceService.getProductsByBrand(decodedBrand)
      .then((response) => setProducts(response.data || []))
      .catch((error) => console.error('Failed to load brand products:', error))
      .finally(() => setLoading(false));
  }, [decodedBrand]);

  return (
    <div className="space-y-8">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm font-medium text-primary">
        <ChevronLeft size={16} /> Back to marketplace
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{decodedBrand}</h1>
        <p className="text-slate-500">Brand page with customer discovery and business flow entry points.</p>
      </div>

      <GlassCard className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <ShoppingBag size={18} />
          <h2 className="text-xl font-bold">Products from {decodedBrand}</h2>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-slate-500">No products found for this brand yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{product.brand}</div>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{product.name}</h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-3">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-primary">₹{product.price.toLocaleString()}</span>
                  <span className="text-xs text-slate-500">{product.inStock ? 'In stock' : 'Out of stock'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default Brand;
