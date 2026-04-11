import React, { useEffect, useState } from 'react';
import { GlassCard, Button } from '@/components/UI';
import { AlertTriangle, MapPin, ShieldAlert } from 'lucide-react';
import PanicButton from '@/components/Safety/PanicButton';
import { safetyService } from '@/services/api';
import { useStore } from '@/store/useStore';
import { useI18n } from '@/lib/i18n';

type SafetyReport = {
  id: string;
  type: string;
  description: string;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
};

const Safety = () => {
  const { user, role } = useStore();
  const { t } = useI18n();
  const [issueType, setIssueType] = useState('harassment');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({ lat: 0, lng: 0, address: '' });
  const [reportMessage, setReportMessage] = useState('');
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [routeSuggestion, setRouteSuggestion] = useState<any>(null);
  const [adminReports, setAdminReports] = useState<SafetyReport[]>([]);

  useEffect(() => {
    if (!user || role !== 'business') {
      return;
    }

    safetyService.getSafetyReportsAdmin()
      .then((response) => setAdminReports(response.data || []))
      .catch((error) => {
        console.error('Failed to load admin reports:', error);
      });
  }, [role, user]);

  const submitAnonymousReport = async () => {
    if (!description.trim()) {
      setReportMessage('Please describe the incident.');
      return;
    }

    try {
      await safetyService.reportSafetyIssuePublic(issueType, description, location, []);
      setDescription('');
      setReportMessage('Anonymous report submitted successfully.');
    } catch (error) {
      console.error('Failed to submit report:', error);
      setReportMessage('Failed to submit anonymous report. Please retry. If you are logged out, this action still works as public report.');
    }
  };

  const fetchSaferRoute = async () => {
    if (!routeFrom.trim() || !routeTo.trim()) {
      return;
    }

    try {
      const response = await safetyService.suggestSaferRoute(routeFrom, routeTo);
      setRouteSuggestion(response.data);
    } catch (error) {
      console.error('Failed to get route suggestion:', error);
      setRouteSuggestion(null);
      setReportMessage('Could not fetch safer route right now. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{t('safety.title')}</h1>
        <p className="mt-2 text-slate-500">Emergency tools, anonymous reporting, and safer-route guidance.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-2 text-red-600">
            <ShieldAlert size={20} />
            <h2 className="text-xl font-bold">Emergency</h2>
          </div>
          <p className="text-sm text-slate-600">Use the floating panic button to send your live location, notify contacts, and find nearby police stations.</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Location capture enabled</li>
            <li>Emergency contact notifications tracked</li>
            <li>Nearest police stations fetched</li>
          </ul>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex items-center gap-2 text-orange-600">
            <AlertTriangle size={20} />
            <h2 className="text-xl font-bold">{t('safety.report')}</h2>
          </div>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="harassment">Harassment</option>
            <option value="threat">Threat</option>
            <option value="unsafe_location">Unsafe Location</option>
            <option value="other">Other</option>
          </select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened (personal details are automatically masked)."
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            value={location.address}
            onChange={(e) => setLocation((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="Location (optional)"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <Button onClick={submitAnonymousReport}>Submit Anonymous Report</Button>
          {reportMessage && <p className="text-sm text-slate-600">{reportMessage}</p>}
        </GlassCard>
      </div>

      <GlassCard className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <MapPin size={20} />
          <h2 className="text-xl font-bold">Safer Route Suggestion</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={routeFrom}
            onChange={(e) => setRouteFrom(e.target.value)}
            placeholder="From"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            value={routeTo}
            onChange={(e) => setRouteTo(e.target.value)}
            placeholder="To"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <Button onClick={fetchSaferRoute}>Get Safer Route</Button>
        </div>
        {routeSuggestion?.recommended && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            Recommended: {routeSuggestion.recommended.label} ({routeSuggestion.recommended.averageSafetyScore.toFixed(1)} / 5)
          </div>
        )}
      </GlassCard>

      {role === 'business' && (
        <GlassCard className="space-y-4">
          <h2 className="text-xl font-bold">Admin Reports View</h2>
          {adminReports.length === 0 ? (
            <p className="text-sm text-slate-500">No reports yet.</p>
          ) : (
            <div className="space-y-2">
              {adminReports.slice(0, 10).map((report) => (
                <div key={report.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                  <div className="font-semibold">{report.type} • {report.status}</div>
                  <div className="text-slate-600">{report.description}</div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      <PanicButton />
    </div>
  );
};

export default Safety;
 
