import React from 'react';
import { GlassCard, Button } from '@/components/UI';
import { ShieldAlert, Phone, MapPin, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

const Safety = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-red-500/20">
          <ShieldAlert size={48} />
        </div>
        <h1 className="text-4xl font-bold">Safety Module</h1>
        <p className="text-slate-500 max-w-lg mx-auto">Your safety is our priority. Use these tools in case of emergency or for peace of mind while working.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SOS Button */}
        <GlassCard className="border-red-100 bg-red-50/30 flex flex-col items-center text-center p-12">
          <h3 className="text-2xl font-bold text-red-600 mb-4">Emergency SOS</h3>
          <p className="text-red-500/70 text-sm mb-8">Pressing this will instantly notify your emergency contacts and local authorities with your current location.</p>
          <button className="w-40 h-40 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 hover:scale-110 active:scale-95 transition-all font-bold text-2xl">
            SOS
          </button>
        </GlassCard>

        {/* Emergency Contacts */}
        <GlassCard className="space-y-6">
          <h3 className="text-xl font-bold">Emergency Contacts</h3>
          <div className="space-y-4">
            {[
              { name: 'Police', number: '911', icon: Phone },
              { name: 'Ambulance', number: '911', icon: Phone },
              { name: 'Women Helpline', number: '1091', icon: Phone },
            ].map((contact, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                    <contact.icon size={20} />
                  </div>
                  <div className="font-bold">{contact.name}</div>
                </div>
                <a href={`tel:${contact.number}`} className="text-primary font-bold text-lg">{contact.number}</a>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="w-full">Edit Personal Contacts</Button>
        </GlassCard>
      </div>

      {/* Safety Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex items-start gap-4">
          <MapPin className="text-primary shrink-0" size={24} />
          <div>
            <h4 className="font-bold mb-1">Live Location</h4>
            <p className="text-xs text-slate-500">Share your real-time location with trusted contacts.</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-start gap-4">
          <ShieldCheck className="text-green-500 shrink-0" size={24} />
          <div>
            <h4 className="font-bold mb-1">Verified Rides</h4>
            <p className="text-xs text-slate-500">All SheShark taxi drivers are background checked.</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-start gap-4">
          <AlertTriangle className="text-yellow-500 shrink-0" size={24} />
          <div>
            <h4 className="font-bold mb-1">Legal Support</h4>
            <p className="text-xs text-slate-500">Access free legal advice for women entrepreneurs.</p>
          </div>
        </GlassCard>
      </div>

      {/* Disclaimer */}
      <GlassCard className="bg-slate-900 text-white/70 text-xs p-6 flex gap-4 items-start">
        <Info size={20} className="text-primary shrink-0" />
        <p>
          LEGAL DISCLAIMER: The SOS feature is a support tool and should not be relied upon as the sole means of emergency communication. SheShark is not responsible for the response time of local authorities. Always prioritize your immediate physical safety.
        </p>
      </GlassCard>
    </div>
  );
};

export default Safety;
