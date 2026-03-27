import React from 'react';
import { GlassCard, Button } from '@/components/UI';
import { ShoppingBag, Search, Filter, Star, Heart, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';

const products = [
  {
    "id": "inv-1",
    "name": "Microtek Heavy Duty 2350 Pure Sine Wave 2000VA/24V Inverter",
    "category": "Solar Inverter",
    "brand": "Microtek",
    "price": 11800,
    "image": "https://m.media-amazon.com/images/I/31MsUvPF-CS._AC_UY436_FMwebp_QL65_.jpg",
    "rating": 4.8,
    "description": "2000VA pure sine wave inverter supporting dual batteries. Ideal for homes, offices and shops with digital display and 2-year warranty."
  },
  {
    "id": "inv-2",
    "name": "Solarverter PUC PRO 3KVA/36V Hybrid Solar Inverter",
    "category": "Solar Inverter",
    "brand": "Generic",
    "price": 29999,
    "image": "https://m.media-amazon.com/images/I/61+syISwrCL._SL1210_.jpg",
    "rating": 4.7,
    "description": "Hybrid MPPT solar inverter with smart energy management and high efficiency solar priority charging."
  },
  {
    "id": "inv-3",
    "name": "UTL Sun Lion 1000 rMPPT Solar Inverter with Lithium Battery",
    "category": "Solar Inverter",
    "brand": "UTL",
    "price": 22000,
    "image": "https://m.media-amazon.com/images/I/61QBVAtqsLL._SL1500_.jpg",
    "rating": 4.9,
    "description": "800VA inverter with inbuilt LiFePO4 battery, rMPPT technology and wall-mountable compact design."
  },
  {
    "id": "bat-1",
    "name": "Exide INVA Master IMTT1500 150Ah Tall Tubular Battery",
    "category": "Solar Battery",
    "brand": "Exide",
    "price": 14102,
    "image": "https://m.media-amazon.com/images/I/51KXnETjtgL._SX679_.jpg",
    "rating": 4.8,
    "description": "150Ah tall tubular inverter battery offering long backup, low maintenance and 60-month warranty."
  },
  {
    "id": "light-1",
    "name": "Epyz 200W Solar Flood Light Outdoor Waterproof",
    "category": "Solar Lighting",
    "brand": "Epyz",
    "price": 4400,
    "image": "https://m.media-amazon.com/images/I/71vlWKh6ayL._SX679_.jpg",
    "rating": 4.6,
    "description": "200W solar flood light with 571 LEDs, remote control, IP65 waterproof design and 10–12 hour illumination."
  },
  {
    "id": "acc-1",
    "name": "ASHAPOWER NEON 70A Solar MPPT Charge Controller",
    "category": "Solar Accessories",
    "brand": "ASHAPOWER",
    "price": 13237,
    "image": "https://m.media-amazon.com/images/I/61DEHk1q4EL._SL1500_.jpg",
    "rating": 4.7,
    "description": "70A MPPT solar charge controller supporting 12V–48V battery banks with ultra-fast power tracking."
  }
];

const womenBrands = [
  {
    "id": "b1",
    "name": "Nykaa",
    "category": "Beauty",
    "url": "https://www.nykaa.com",
    "image": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQFjYOV6Mu2wL1JmYP0VpTMvVPveKlRpdn2Y-OniAU0C6JEBKYKIOXNX2spcmYZ"
  }
];

const Marketplace = () => {
  const { addToCart } = useStore();

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-slate-500">Discover premium solar products and women-led brands.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="glass pl-12 pr-6 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <Button variant="secondary" icon={Filter}>Filters</Button>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingBag className="text-primary" /> Solar Equipment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <GlassCard key={product.id} className="p-0 overflow-hidden group flex flex-col">
              <div className="relative h-56 overflow-hidden bg-white">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-primary transition-colors">
                  <Heart size={20} />
                </button>
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                  {product.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="text-lg font-bold leading-tight">{product.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500 font-bold shrink-0">
                    <Star size={16} fill="currentColor" />
                    {product.rating}
                  </div>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-2xl font-bold text-primary">₹{product.price.toLocaleString()}</div>
                  <Button 
                    onClick={() => addToCart(product)}
                    className="rounded-xl p-3"
                  >
                    <Plus size={20} />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Heart className="text-health-pink" /> Women-Led Brands
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {womenBrands.map((brand) => (
            <a 
              key={brand.id} 
              href={brand.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass p-6 rounded-3xl flex flex-col items-center gap-4 hover:scale-105 transition-transform group"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-2">
                <img 
                  src={brand.image} 
                  alt={brand.name} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center">
                <div className="font-bold group-hover:text-primary transition-colors">{brand.name}</div>
                <div className="text-xs text-slate-400">{brand.category}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
