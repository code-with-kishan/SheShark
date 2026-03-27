import React, { useState } from 'react';
import { GlassCard, Button } from '@/components/UI';
import { Car, MapPin, Navigation, Clock, Shield, Star, Search } from 'lucide-react';

const Taxi = () => {
  const [status, setStatus] = useState<'idle' | 'searching' | 'assigned' | 'in-progress'>('idle');

  const handleBook = () => {
    setStatus('searching');
    setTimeout(() => setStatus('assigned'), 3000);
    setTimeout(() => setStatus('in-progress'), 6000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-8">
      {/* Booking Panel */}
      <GlassCard className="w-full lg:w-96 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">SheShark Taxi</h1>
          <p className="text-slate-500">Women-only safe transportation.</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
            <input 
              type="text" 
              placeholder="Pickup Location" 
              className="w-full glass pl-12 pr-4 py-4 rounded-2xl focus:outline-none"
              defaultValue="123 Solar Way, Green City"
            />
          </div>
          <div className="relative">
            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Where to?" 
              className="w-full glass pl-12 pr-4 py-4 rounded-2xl focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Available Rides</h4>
          {[
            { type: 'Shark Mini', price: '$12.50', time: '3 min', icon: Car },
            { type: 'Shark Premium', price: '$22.00', time: '5 min', icon: Car },
          ].map((ride, i) => (
            <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <ride.icon size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold">{ride.type}</div>
                  <div className="text-xs text-slate-400">{ride.time} away</div>
                </div>
              </div>
              <div className="font-bold text-primary">{ride.price}</div>
            </button>
          ))}
        </div>

        <Button 
          onClick={handleBook} 
          disabled={status !== 'idle'}
          className="w-full py-4 text-lg mt-auto"
        >
          {status === 'idle' ? 'Book Safe Ride' : 'Booking...'}
        </Button>
      </GlassCard>

      {/* Map Area */}
      <GlassCard className="flex-1 p-0 overflow-hidden relative bg-slate-100">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-122.4194,37.7749,12,0/800x600?access_token=pk.mock')] bg-cover" />
        </div>

        {/* Status Overlay */}
        <AnimatePresence>
          {status !== 'idle' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 left-8 right-8"
            >
              <GlassCard className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg animate-pulse">
                    <Car size={32} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary uppercase tracking-widest">
                      {status === 'searching' ? 'Searching for driver...' : 
                       status === 'assigned' ? 'Driver Assigned' : 'Ride in Progress'}
                    </div>
                    <div className="text-xl font-bold">
                      {status === 'searching' ? 'Finding nearby SheSharks' : 
                       status === 'assigned' ? 'Sarah (Toyota Prius)' : 'Heading to destination'}
                    </div>
                  </div>
                </div>
                {status === 'assigned' && (
                  <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-bold">
                    <Star size={18} fill="currentColor" /> 4.9
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Safety Badge */}
        <div className="absolute top-8 right-8 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
          <Shield size={18} /> Verified Safe
        </div>
      </GlassCard>
    </div>
  );
};

import { AnimatePresence, motion } from 'motion/react';
export default Taxi;
