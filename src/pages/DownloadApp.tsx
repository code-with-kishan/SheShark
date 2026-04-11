import React from 'react';
import { GlassCard, Button } from '@/components/UI';
import { Download, Smartphone, QrCode } from 'lucide-react';

const DownloadApp = () => {
  const apkLink = '/Sheshark.apk';

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Download App</h1>
        <p className="mt-2 text-slate-500">Install SheShark mobile app for on-the-go access.</p>
      </div>

      <GlassCard className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 to-white p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Android APK</h2>
            <p className="mt-2 text-sm text-slate-600">
              Get the latest SheShark Android build with marketplace, safety tools, and AI support.
            </p>
            <div className="mt-6">
              <a href={apkLink} download>
                <Button>
                  <Download size={18} /> Download APK
                </Button>
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <QrCode size={22} />
            </div>
            <p className="text-sm text-slate-600">Open this page on your phone browser and tap Download APK.</p>
            <p className="mt-3 text-xs text-slate-400">iOS build: coming soon</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="rounded-2xl border border-slate-100 bg-white p-5 text-sm text-slate-600">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <Smartphone size={16} /> Installation tip
        </div>
        <p className="mt-2">If Android blocks installation, allow Install from Unknown Sources for your browser once and retry.</p>
      </GlassCard>
    </div>
  );
};

export default DownloadApp;
 
