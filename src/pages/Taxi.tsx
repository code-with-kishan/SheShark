import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GlassCard, Button } from '@/components/UI';
import { Car, MapPin, Navigation, Shield, Star, UserRound } from 'lucide-react';

type TaxiStatus = 'idle' | 'searching' | 'assigned' | 'in-progress';

const rides = [
  { id: 'mini', type: 'Shark Mini', price: '₹289', eta: '3 min', capacity: '3 seats' },
  { id: 'comfort', type: 'Shark Comfort', price: '₹399', eta: '5 min', capacity: '4 seats' },
  { id: 'premium', type: 'Shark Premium', price: '₹599', eta: '7 min', capacity: '4 seats' },
];

const driversByRide: Record<string, { name: string; car: string; rating: number; eta: string }[]> = {
  mini: [
    { name: 'Ananya', car: 'Hyundai i10', rating: 4.8, eta: '3 min' },
    { name: 'Neha', car: 'Suzuki Celerio', rating: 4.7, eta: '4 min' },
  ],
  comfort: [
    { name: 'Priya', car: 'Honda Amaze', rating: 4.9, eta: '5 min' },
    { name: 'Ritika', car: 'Toyota Etios', rating: 4.8, eta: '6 min' },
  ],
  premium: [
    { name: 'Sarah', car: 'Toyota Prius', rating: 4.9, eta: '7 min' },
    { name: 'Kavya', car: 'Hyundai Verna', rating: 4.9, eta: '8 min' },
  ],
};

const Taxi = () => {
  const [status, setStatus] = useState<TaxiStatus>('idle');
  const [selectedRideId, setSelectedRideId] = useState('mini');
  const [pickup, setPickup] = useState('123 Solar Way, Green City');
  const [dropoff, setDropoff] = useState('');
  const [assignedDriverIndex, setAssignedDriverIndex] = useState(0);

  const selectedRide = useMemo(() => rides.find((ride) => ride.id === selectedRideId) || rides[0], [selectedRideId]);
  const availableDrivers = driversByRide[selectedRideId] || [];
  const assignedDriver = availableDrivers[Math.min(assignedDriverIndex, Math.max(availableDrivers.length - 1, 0))];

  const handleBook = () => {
    if (!dropoff.trim()) {
      return;
    }

    setAssignedDriverIndex(Math.floor(Math.random() * Math.max(availableDrivers.length, 1)));
    setStatus('searching');
    setTimeout(() => setStatus('assigned'), 1800);
    setTimeout(() => setStatus('in-progress'), 5200);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-5 lg:gap-8">
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
              value={pickup}
              onChange={(event) => setPickup(event.target.value)}
              className="w-full glass pl-12 pr-4 py-4 rounded-2xl focus:outline-none"
            />
          </div>
          <div className="relative">
            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Where to?"
              value={dropoff}
              onChange={(event) => setDropoff(event.target.value)}
              className="w-full glass pl-12 pr-4 py-4 rounded-2xl focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Available Rides</h4>
          {rides.map((ride) => (
            <button
              key={ride.id}
              type="button"
              onClick={() => setSelectedRideId(ride.id)}
              className={
                selectedRideId === ride.id
                  ? 'w-full flex items-center justify-between p-4 rounded-2xl border-2 border-primary bg-primary/5 transition-all'
                  : 'w-full flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all'
              }
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Car size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold">{ride.type}</div>
                  <div className="text-xs text-slate-400">{ride.eta} away • {ride.capacity}</div>
                </div>
              </div>
              <div className="font-bold text-primary">{ride.price}</div>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Alloted Driver Pool</p>
          <div className="mt-2 space-y-2">
            {availableDrivers.map((driver) => (
              <div key={driver.name} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <UserRound size={14} className="text-primary" />
                  <span className="font-medium">{driver.name}</span>
                </div>
                <span className="text-slate-500">{driver.car}</span>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleBook} disabled={status !== 'idle' || !dropoff.trim()} className="w-full py-4 text-lg mt-auto">
          {status === 'idle' ? 'Book Safe Ride' : 'Booking...'}
        </Button>
      </GlassCard>

      <GlassCard className="flex-1 p-0 overflow-hidden relative bg-slate-100 min-h-[26rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-white to-emerald-100" />

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 700" preserveAspectRatio="none">
          <path d="M70,640 C240,420 390,460 540,320 C680,190 760,180 940,90" stroke="#94a3b8" strokeWidth="6" fill="none" strokeDasharray="16 12" />
          <motion.circle
            cx="70"
            cy="640"
            r="11"
            fill="#ec4899"
            animate={status === 'in-progress' ? { cx: [70, 240, 390, 540, 680, 760, 940], cy: [640, 420, 460, 320, 190, 180, 90] } : { cx: 70, cy: 640 }}
            transition={{ duration: 6, repeat: status === 'in-progress' ? Infinity : 0, ease: 'linear' }}
          />
        </svg>

        <div className="absolute left-3 top-3 sm:left-8 sm:top-8 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-slate-600 shadow max-w-[42vw] sm:max-w-none truncate">
          Pickup: {pickup || 'Not set'}
        </div>
        <div className="absolute right-3 top-3 sm:right-8 sm:top-8 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-slate-600 shadow max-w-[42vw] sm:max-w-none truncate text-right">
          Drop: {dropoff || 'Not set'}
        </div>

        <AnimatePresence>
          {status !== 'idle' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-4 left-3 right-3 sm:bottom-8 sm:left-8 sm:right-8">
              <GlassCard className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg animate-pulse">
                    <Car size={32} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary uppercase tracking-widest">
                      {status === 'searching' ? 'Searching for driver...' : status === 'assigned' ? 'Driver Assigned' : 'Ride in Progress'}
                    </div>
                    <div className="text-xl font-bold">
                      {status === 'searching'
                        ? `Finding ${selectedRide.type}`
                        : status === 'assigned'
                          ? `${assignedDriver?.name || 'Driver'} (${assignedDriver?.car || selectedRide.type})`
                          : `On the way with ${assignedDriver?.name || 'driver'}`}
                    </div>
                  </div>
                </div>
                {(status === 'assigned' || status === 'in-progress') && assignedDriver && (
                  <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-bold">
                    <Star size={18} fill="currentColor" /> {assignedDriver.rating.toFixed(1)}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-16 right-3 sm:top-20 sm:right-8 flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold shadow-lg text-xs sm:text-sm">
          <Shield size={18} /> Verified Safe
        </div>
      </GlassCard>
    </div>
  );
};

export default Taxi;
