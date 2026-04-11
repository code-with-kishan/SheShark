import React, { useEffect, useMemo, useState } from 'react';
import { GlassCard, Button } from '@/components/UI';
import { servicesService } from '@/services/api';
import { useStore } from '@/store/useStore';
import { useI18n } from '@/lib/i18n';
import { Calendar, RefreshCw } from 'lucide-react';

interface ServiceListing {
  id: string;
  title: string;
  description: string;
  category: string;
  hourlyRate: number;
  userId: string;
  availability: { day: string; start: string; end: string }[];
}

const initialForm = {
  title: '',
  description: '',
  category: 'consulting',
  hourlyRate: 500,
};

const Services = () => {
  const { t } = useI18n();
  const { role } = useStore();
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [form, setForm] = useState(initialForm);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [earnings, setEarnings] = useState<any>(null);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId),
    [selectedServiceId, services]
  );

  const refreshServices = async () => {
    const response = await servicesService.getServices();
    setServices(response.data || []);
  };

  const refreshEarnings = async () => {
    try {
      const response = await servicesService.getEarnings();
      setEarnings(response.data);
    } catch (error) {
      console.error('Failed to load earnings:', error);
    }
  };

  useEffect(() => {
    refreshServices().catch((error) => console.error(error));
    if (role === 'business') {
      refreshEarnings().catch((error) => console.error(error));
    }
  }, [role]);

  const createListing = async () => {
    try {
      await servicesService.createServiceListing(form);
      setMessage('Service listing created successfully.');
      setForm(initialForm);
      await refreshServices();
      await refreshEarnings();
    } catch (error) {
      console.error('Create listing failed:', error);
      setMessage('Failed to create service listing.');
    }
  };

  const bookService = async () => {
    if (!selectedServiceId || !startTime || !endTime) {
      setMessage('Select a service and time range first.');
      return;
    }

    try {
      await servicesService.createBooking(selectedServiceId, startTime, endTime);
      setMessage('Booking created successfully.');
      setSelectedServiceId('');
      setStartTime('');
      setEndTime('');
      await refreshEarnings();
    } catch (error) {
      console.error('Booking failed:', error);
      setMessage('Failed to create booking.');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Skill Monetization</h1>
        <p className="text-slate-500">Create a service, set your hourly rate, and accept bookings.</p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => refreshServices()}>
            <RefreshCw size={16} /> Refresh Services
          </Button>
          <Button variant="secondary" onClick={() => setMessage('Tip: Select a service card first, then set booking times.')}>How to book</Button>
        </div>
      </div>

      {message && (
        <GlassCard className="border border-slate-200 bg-slate-50 text-sm text-slate-700">{message}</GlassCard>
      )}

      {role === 'business' && (
        <GlassCard className="space-y-4">
          <h2 className="text-xl font-bold">Create Service Listing</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Service title"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              value={form.hourlyRate}
              onChange={(e) => setForm((prev) => ({ ...prev, hourlyRate: Number(e.target.value) }))}
              type="number"
              min="1"
              placeholder="Hourly rate"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="cooking">Cooking</option>
              <option value="tutoring">Tutoring</option>
              <option value="crafts">Crafts</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Service description"
              rows={3}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm md:col-span-2"
            />
          </div>
          <Button onClick={createListing}>Publish Service</Button>
        </GlassCard>
      )}

      <GlassCard className="space-y-3 sm:space-y-4">
        <h2 className="text-xl font-bold">Available Services</h2>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelectedServiceId(service.id)}
              className={
                selectedServiceId === service.id
                  ? 'rounded-2xl border-2 border-primary bg-white p-3 sm:p-4 shadow-sm text-left'
                  : 'rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm text-left hover:border-primary/40'
              }
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{service.category}</div>
              <h3 className="mt-1 text-base sm:text-lg font-bold text-slate-900">{service.title}</h3>
              <p className="mt-2 text-sm text-slate-600 line-clamp-3">{service.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-bold text-primary">₹{service.hourlyRate}/hr</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {selectedServiceId === service.id ? 'Selected' : 'Tap to Select'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="space-y-3">
        <h2 className="text-xl font-bold">Selected Service Details</h2>
        {selectedService ? (
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm uppercase tracking-wide text-slate-500">{selectedService.category}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{selectedService.title}</p>
            <p className="mt-2 text-sm text-slate-600">{selectedService.description}</p>
            <p className="mt-2 text-sm font-semibold text-primary">Hourly Rate: ₹{selectedService.hourlyRate}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No service selected yet. Click any service card to activate booking actions.</p>
        )}
      </GlassCard>

      <GlassCard className="space-y-3 sm:space-y-4">
        <h2 className="text-xl font-bold">Book a Service</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Choose a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>{service.title}</option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <Button onClick={bookService}>Create Booking</Button>
        <Button
          variant="secondary"
          onClick={() => {
            setStartTime('');
            setEndTime('');
            setMessage('Booking form reset.');
          }}
        >
          <Calendar size={16} /> Reset Time
        </Button>
      </GlassCard>

      {role === 'business' && earnings && (
        <GlassCard className="space-y-2">
          <h2 className="text-xl font-bold">Earnings</h2>
          <p className="text-sm text-slate-600">Total earnings: ₹{earnings.totalEarnings}</p>
          <p className="text-sm text-slate-600">Completed bookings: {earnings.completedBookings}</p>
          <p className="text-sm text-slate-600">Pending bookings: {earnings.pendingBookings}</p>
        </GlassCard>
      )}
    </div>
  );
};

export default Services;
 
