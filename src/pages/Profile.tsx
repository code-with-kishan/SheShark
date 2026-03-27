import React from 'react';
import { GlassCard, Button } from '@/components/UI';
import { User, Mail, Shield, Bell, CreditCard, LogOut, Camera, Edit2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { auth } from '@/lib/firebase';

const Profile = () => {
  const { user } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="secondary" icon={Edit2}>Edit Profile</Button>
      </div>

      {/* Profile Header */}
      <GlassCard className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
            <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
            <Camera size={18} />
          </button>
        </div>
        
        <div className="flex-1 space-y-2">
          <h2 className="text-3xl font-bold">{user?.displayName}</h2>
          <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2">
            <Mail size={16} /> {user?.email}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">Solar Entrepreneur</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">Verified Member</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-xs font-bold rounded-full">Top Contributor</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="glass p-4 text-center">
            <div className="text-2xl font-bold text-primary">1,250</div>
            <div className="text-xs text-slate-400 font-bold uppercase">Shark Points</div>
          </div>
        </div>
      </GlassCard>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Shield size={20} className="text-primary" /> Security & Privacy
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Two-Factor Authentication', status: 'Enabled' },
              { label: 'Data Sharing', status: 'Restricted' },
              { label: 'Profile Visibility', status: 'Public' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="text-xs font-bold text-primary">{item.status}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Bell size={20} className="text-primary" /> Notifications
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Email Notifications', status: 'On' },
              { label: 'Push Notifications', status: 'On' },
              { label: 'Marketing Updates', status: 'Off' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="text-xs font-bold text-primary">{item.status}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="md:col-span-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
              <CreditCard size={24} />
            </div>
            <div>
              <h4 className="font-bold">Payment Methods</h4>
              <p className="text-sm text-slate-500">Manage your cards and billing info.</p>
            </div>
          </div>
          <Button variant="secondary">Manage</Button>
        </GlassCard>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={() => auth.signOut()}
          className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-8 py-4 rounded-2xl transition-all"
        >
          <LogOut size={20} /> Sign Out of All Devices
        </button>
      </div>
    </div>
  );
};

export default Profile;
