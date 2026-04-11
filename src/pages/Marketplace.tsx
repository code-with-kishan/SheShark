import React, { useEffect, useMemo, useState } from 'react';
import { Upload, Search, Box } from 'lucide-react';
import { GlassCard, Button } from '@/components/UI';
import ProductCard from '@/components/Marketplace/ProductCard';
import ModelViewer from '@/components/Marketplace/ModelViewer';
import { marketplaceService } from '@/services/api';
import { useStore } from '@/store/useStore';
import { useI18n } from '@/lib/i18n';
import { Link, useNavigate } from 'react-router-dom';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  modelUrl?: string;
  brand?: string;
  rating: number;
  reviews: any[];
  inStock: boolean;
  seller: {
    id: string;
    name: string;
  };
};

const Marketplace = () => {
  const { t } = useI18n();
  const { user, addToCart } = useStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState<{ url: string; title: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const fetchProducts = async (query?: string) => {
    try {
      const response = await marketplaceService.getProducts(undefined, undefined, query || undefined);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    marketplaceService.getAllBrands()
      .then((response) => setBrands(response.data || []))
      .catch((error) => console.error('Failed to fetch brands:', error));
  }, []);

  const shownProducts = useMemo(() => {
    if (!search.trim()) {
      return products;
    }
    const q = search.trim().toLowerCase();
    return products.filter((p) =>
      [p.name, p.description, p.brand, p.seller?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [products, search]);

  const handleUpload = async (file: File | null) => {
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.glb')) {
      setUploadError('Only .glb files are supported.');
      return;
    }

    setUploadError('');
    setUploading(true);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await marketplaceService.uploadModelBase64(file.name, base64);
      await fetchProducts();
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to upload model. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t('marketplace.title')}</h1>
          <p className="text-slate-500">Browse products with 3D model previews.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Upload size={16} />
            {uploading ? 'Uploading...' : t('marketplace.upload')}
            <input
              type="file"
              accept=".glb,model/gltf-binary"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files?.[0] || null)}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <GlassCard className="p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, brand, or description"
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </GlassCard>

      {uploadError && (
        <GlassCard className="border border-red-200 bg-red-50 text-sm text-red-700">{uploadError}</GlassCard>
      )}

      {shownProducts.length === 0 ? (
        <GlassCard className="p-10 text-center text-slate-500">
          <Box className="mx-auto mb-3" />
          No products found.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {shownProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onView3D={(url) => setSelectedModel({ url, title: product.name })}
            />
          ))}
        </div>
      )}

      <ModelViewer
        isOpen={Boolean(selectedModel)}
        modelUrl={selectedModel?.url || ''}
        title={selectedModel?.title}
        onClose={() => setSelectedModel(null)}
      />

      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => fetchProducts(search)}>Refresh Products</Button>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Collaborated Brands</h2>
          <p className="text-slate-500">Open a brand page to explore its products and flow.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands/${encodeURIComponent(brand.name)}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-sm font-semibold text-slate-800">{brand.name}</div>
              <div className="mt-1 text-xs text-slate-500">{brand.description}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
 
