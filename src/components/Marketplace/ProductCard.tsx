import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Star, Heart, Share2 } from 'lucide-react';
import clsx from 'clsx';
import * as THREE from 'three';

interface Product {
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
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onView3D?: (modelUrl: string) => void;
}

const MODEL_PREVIEW_MAP: Record<string, string> = {
  '/models/demo.glb': '/models/previews/demo.svg',
  '/models/demo1.glb': '/models/previews/demo1.svg',
  '/models/demo2.glb': '/models/previews/demo2.svg',
  '/models/demo3.glb': '/models/previews/demo3.svg',
  '/models/demo4.glb': '/models/previews/demo4.svg',
  '/models/demo5.glb': '/models/previews/demo5.svg',
  '/models/demo6.glb': '/models/previews/demo6.svg',
};

function getPreviewImage(product: Product): string {
  if (product.modelUrl && MODEL_PREVIEW_MAP[product.modelUrl]) {
    return MODEL_PREVIEW_MAP[product.modelUrl];
  }
  if (product.images?.[0]) {
    return product.images[0];
  }
  return '/models/previews/default.svg';
}

const ModelCardPreview = ({ modelUrl, fallbackSrc, alt }: { modelUrl: string; fallbackSrc: string; alt: string }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    let mounted = true;
    let frameId = 0;
    let model: THREE.Object3D | null = null;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe2e8f0);

    const width = Math.max(host.clientWidth, 320);
    const height = Math.max(host.clientHeight, 192);
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 2000);
    camera.position.set(0, 0.9, 2.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    host.innerHTML = '';
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const onResize = () => {
      const el = hostRef.current;
      if (!el) {
        return;
      }
      const nextW = Math.max(el.clientWidth, 320);
      const nextH = Math.max(el.clientHeight, 192);
      camera.aspect = nextW / nextH;
      camera.updateProjectionMatrix();
      renderer.setSize(nextW, nextH);
    };

    Promise.all([
      import('three/examples/jsm/loaders/GLTFLoader.js') as Promise<any>,
    ])
      .then(([loaderModule]) => {
        const Loader = loaderModule.GLTFLoader;
        const loader = new Loader();

        loader.load(
          modelUrl,
          (gltf: any) => {
            if (!mounted) {
              return;
            }
            const loaded = gltf.scene as THREE.Object3D;
            model = loaded;
            scene.add(loaded);

            const box = new THREE.Box3().setFromObject(loaded);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            loaded.position.sub(center);

            const maxDim = Math.max(size.x, size.y, size.z, 1);
            camera.position.set(maxDim * 0.25, maxDim * 0.2, maxDim * 1.9);
            camera.near = Math.max(0.01, maxDim / 1000);
            camera.far = maxDim * 30;
            camera.updateProjectionMatrix();

            setIsReady(true);
          },
          undefined,
          () => {
            if (!mounted) {
              return;
            }
            setFailed(true);
          }
        );
      })
      .catch(() => {
        if (mounted) {
          setFailed(true);
        }
      });

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (model) {
        model.rotation.y += 0.006;
      }
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', onResize);

    return () => {
      mounted = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      if (model) {
        model.traverse((obj: THREE.Object3D) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) {
            mesh.geometry.dispose();
          }
          const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose());
          } else {
            material?.dispose();
          }
        });
      }
      renderer.dispose();
      if (hostRef.current) {
        hostRef.current.innerHTML = '';
      }
    };
  }, [modelUrl]);

  if (failed) {
    return <img src={fallbackSrc} alt={alt} className="w-full h-full object-cover" />;
  }

  return (
    <div className="relative h-full w-full">
      <div ref={hostRef} className="h-full w-full" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-xs text-slate-600">
          Loading preview...
        </div>
      )}
    </div>
  );
};

/**
 * Product Card Component with 3D Model Support
 * Displays product information and allows viewing 3D models
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onView3D }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [previewImage, setPreviewImage] = useState(() => getPreviewImage(product));

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(product.price);

  useEffect(() => {
    setPreviewImage(getPreviewImage(product));
  }, [product]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      setIsSharing(true);
      setTimeout(() => setIsSharing(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative bg-gray-200 h-48">
        {product.modelUrl ? (
          <ModelCardPreview
            modelUrl={product.modelUrl}
            fallbackSrc={previewImage}
            alt={product.name}
          />
        ) : previewImage ? (
          <img src={previewImage} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
            No Image
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded text-xs font-semibold">
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </div>

        {/* 3D Model Badge */}
        {product.modelUrl && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
            3D Model
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand & Seller */}
        <p className="text-xs text-gray-500 mb-1">
          {product.brand || product.seller.name}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star size={16} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({product.reviews.length})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-pink-600">₹{formattedPrice}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={clsx(
                'p-1 rounded transition',
                isFavorited
                  ? 'bg-pink-100 text-pink-500'
                  : 'bg-gray-100 text-gray-500 hover:text-pink-500'
              )}
            >
              <Heart size={16} />
            </button>
            <button onClick={handleShare} className="p-1 rounded bg-gray-100 text-gray-500 hover:text-blue-500 transition">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {product.modelUrl && (
            <button
              onClick={() => onView3D?.(product.modelUrl!)}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
            >
              View 3D
            </button>
          )}
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={!product.inStock}
            className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 disabled:bg-gray-400 transition text-sm font-medium flex items-center justify-center gap-1"
          >
            <ShoppingCart size={16} />
            {product.inStock ? 'Add' : 'Out of Stock'}
          </button>
        </div>

        {isSharing && <p className="text-xs text-green-600 mt-2 text-center">Link copied!</p>}
      </div>
    </div>
  );
};

export default ProductCard;
