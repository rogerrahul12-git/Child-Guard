import React, { useState } from 'react';
import { AppItem } from '../types';
import { Trash2, Check, X, ShieldAlert, Plus, Smartphone, AlertTriangle } from 'lucide-react';

interface AppsManagementTabProps {
  apps: AppItem[];
  removeRequests: number[];
  onApproveRemoval: (appId: number) => void;
  onDeclineRemoval: (appId: number) => void;
  onRemoveApp: (appId: number) => void;
  onAddApp: (newApp: AppItem) => void;
}

export const AppsManagementTab: React.FC<AppsManagementTabProps> = ({
  apps,
  removeRequests,
  onApproveRemoval,
  onDeclineRemoval,
  onRemoveApp,
  onAddApp,
}) => {
  const [appToDelete, setAppToDelete] = useState<AppItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppCategory, setNewAppCategory] = useState('Gaming');
  const [newAppColor, setNewAppColor] = useState('#8b5cf6');

  const pendingApps = removeRequests
    .map((id) => apps.find((a) => a.id === id))
    .filter((a): a is AppItem => Boolean(a));

  const handleConfirmDelete = () => {
    if (appToDelete) {
      onRemoveApp(appToDelete.id);
      setAppToDelete(null);
    }
  };

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    const initials = newAppName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const created: AppItem = {
      id: Date.now(),
      name: newAppName.trim(),
      mins: 15,
      category: newAppCategory,
      color: newAppColor,
      iconLetter: initials || 'APP',
      riskRating: newAppCategory === 'Social Media' ? 'High' : 'Moderate',
    };

    onAddApp(created);
    setNewAppName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Pending Removal Requests Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              Pending Removal Requests
              {pendingApps.length > 0 && (
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  {pendingApps.length}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Maya initiated these requests from her device asking you to remove the app.
            </p>
          </div>
        </div>

        {pendingApps.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
            No pending removal requests from Maya right now.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingApps.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0"
                    style={{ backgroundColor: app.color }}
                  >
                    {app.iconLetter}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900">
                      Maya asked to remove {app.name}
                    </h3>
                    <span className="text-xs text-slate-600">
                      Used {app.mins} minutes today · Category: {app.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => onDeclineRemoval(app.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                    Decline
                  </button>
                  <button
                    onClick={() => onApproveRemoval(app.id)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve & Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Installed Apps Grid / List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Installed Apps on Maya&apos;s Device
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md tabular-nums">
                {apps.reduce((sum, a) => sum + a.mins, 0)} min today (Child Sync)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Only a parent can remove an app. Deleting an app here removes it immediately from Maya&apos;s device.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Simulate App Install
          </button>
        </div>

        {apps.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No applications installed on this device.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {apps.map((app) => (
              <div
                key={app.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0"
                    style={{ backgroundColor: app.color }}
                  >
                    {app.iconLetter}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900">{app.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{app.category}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          app.riskRating === 'High'
                            ? 'text-rose-600 font-semibold'
                            : app.riskRating === 'Moderate'
                            ? 'text-amber-600 font-medium'
                            : 'text-emerald-600 font-medium'
                        }
                      >
                        {app.riskRating} Compulsion Risk
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-700 tabular-nums block">
                      {app.mins} min today
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {Math.floor(app.mins / 60)}h {app.mins % 60}m
                    </span>
                  </div>

                  <button
                    onClick={() => setAppToDelete(app)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove App from Device"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {appToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Remove {appToDelete.name}?
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              This will uninstall {appToDelete.name} from Maya&apos;s Galaxy Tab. She will not be able to re-install it without your parent PIN approval.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setAppToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
              >
                Yes, Remove App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add App Simulator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <form
            onSubmit={handleCreateApp}
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Simulate New App Installation
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 mb-6">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  App Name
                </label>
                <input
                  type="text"
                  required
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  placeholder="e.g. Roblox, Duolingo, TikTok"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Category
                </label>
                <select
                  value={newAppCategory}
                  onChange={(e) => setNewAppCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Gaming">Gaming</option>
                  <option value="Education">Education</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Technology">Technology</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  App Color Accent
                </label>
                <div className="flex items-center gap-2">
                  {['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewAppColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        newAppColor === c ? 'scale-125 ring-2 ring-slate-800 ring-offset-1' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Add to Maya&apos;s Device
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
