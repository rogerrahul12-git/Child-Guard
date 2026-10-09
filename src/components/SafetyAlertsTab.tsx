import React, { useState } from 'react';
import { SafetyAlert } from '../types';
import { ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Send, Filter } from 'lucide-react';

interface SafetyAlertsTabProps {
  alerts: SafetyAlert[];
  onMarkReviewed: (alertId: number) => void;
  onSelectForMentoring: (alert: SafetyAlert) => void;
  onAddAlert: (newAlert: SafetyAlert) => void;
}

export const SafetyAlertsTab: React.FC<SafetyAlertsTabProps> = ({
  alerts,
  onMarkReviewed,
  onSelectForMentoring,
  onAddAlert,
}) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'open'>('open');
  const [simText, setSimText] = useState('Hey Maya, what school do you go to? Send me your WhatsApp number!');
  const [simType, setSimType] = useState<'grooming' | 'scam' | 'cyberbullying'>('grooming');
  const [simulating, setSimulating] = useState(false);

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'high') return a.severity === 'high';
    if (filter === 'open') return !a.reviewed;
    return true;
  });

  const handleSimulateThreat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simText.trim()) return;

    setSimulating(true);
    setTimeout(() => {
      let title = 'Suspicious query intercepted';
      let sev: 'high' | 'medium' = 'high';
      let act = 'Talk about why stranger questions about locations must always be deflected.';

      if (simType === 'grooming') {
        title = 'Location & contact inquiry quarantined';
        sev = 'high';
        act = 'Reinforce rule: Never share school, neighborhood, or private contact details with anyone online.';
      } else if (simType === 'scam') {
        title = 'Malicious phishing link blocked';
        sev = 'high';
        act = 'Explain how fake giveaway sites steal user account passwords.';
      } else {
        title = 'Hostile language flag in gaming group';
        sev = 'medium';
        act = 'Check in on Maya’s emotional response and practice muting toxic players.';
      }

      const generatedAlert: SafetyAlert = {
        id: Date.now(),
        severity: sev,
        type: 'Cyber Safety',
        title,
        detail: `RINAYA intercepted: "${simText.trim()}". Outbound contact was blocked and account was quarantined for parent review.`,
        time: 'Just now',
        reviewed: false,
        recommendedAction: act,
      };

      onAddAlert(generatedAlert);
      setSimulating(false);
      setFilter('open');
    }, 700);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Filter Tabs & Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              Safety & Behavioral Incident Log
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time cyber protection shields and wellbeing sentiment flags.
            </p>
          </div>

          {/* Filter segment */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setFilter('open')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filter === 'open'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unreviewed ({alerts.filter((a) => !a.reviewed).length})
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filter === 'high'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              High Severity ({alerts.filter((a) => a.severity === 'high').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Alerts ({alerts.length})
            </button>
          </div>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            No alerts match this filter. Everything looks calm! 🎉
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all ${
                  alert.reviewed
                    ? 'bg-slate-50/70 border-slate-200 opacity-70'
                    : alert.severity === 'high'
                    ? 'bg-rose-50/40 border-rose-200'
                    : 'bg-amber-50/40 border-amber-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md ${
                        alert.severity === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {alert.severity} Severity
                    </span>
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {alert.type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 ml-1">
                      {alert.title}
                    </h3>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {alert.time}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                  {alert.detail}
                </p>

                {alert.recommendedAction && (
                  <div className="p-3 bg-white/80 rounded-lg border border-slate-200/80 text-xs text-slate-600 mb-3 flex items-start gap-2">
                    <strong className="text-slate-800 shrink-0">Mentoring recommendation:</strong>
                    <span>{alert.recommendedAction}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-400">
                    Status: {alert.reviewed ? 'Reviewed by parent' : 'Pending parental review'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectForMentoring(alert)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Get AI Mentoring Script
                    </button>

                    {!alert.reviewed && (
                      <button
                        onClick={() => onMarkReviewed(alert.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Mark as Reviewed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cyber Threat Interception Simulator */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Cyber Safety Shield Simulator
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Test how RINAYA intercepts predatory inquiries, suspicious links, and personal data leaks in real-time.
        </p>

        <form onSubmit={handleSimulateThreat} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setSimType('grooming');
                setSimText('Hey Maya, what school do you go to? Send me your WhatsApp number!');
              }}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                simType === 'grooming'
                  ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              1. Unknown Contact Location Inquiry
            </button>
            <button
              type="button"
              onClick={() => {
                setSimType('scam');
                setSimText('Free Robux! Enter your Roblox username & password at http://vbucks-free-claim.xyz');
              }}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                simType === 'scam'
                  ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              2. Phishing Scam Link
            </button>
            <button
              type="button"
              onClick={() => {
                setSimType('cyberbullying');
                setSimText('You are terrible at this game, nobody likes you. Leave our server right now.');
              }}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                simType === 'cyberbullying'
                  ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              3. Toxic Harassment in Gaming Chat
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={simText}
              onChange={(e) => setSimText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={simulating}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shrink-0"
            >
              {simulating ? 'Intercepting...' : 'Simulate Interception'}
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
