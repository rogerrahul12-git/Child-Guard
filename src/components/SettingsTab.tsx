import React, { useState } from 'react';
import { ShutdownConfig } from '../types';
import { Sliders, Power, KeyRound, ShieldAlert, Check, Clock, Info, RotateCcw } from 'lucide-react';

interface SettingsTabProps {
  dailyLimit: number;
  onUpdateLimit: (val: number) => void;
  shutdown: ShutdownConfig;
  onUpdateShutdown: (config: Partial<ShutdownConfig>) => void;
  onDemoAddUsage: (mins: number) => void;
  onResetUsage?: () => void;
  parentPin: string;
  onUpdatePin: (newPin: string) => void;
  totalMinsUsed: number;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  dailyLimit,
  onUpdateLimit,
  shutdown,
  onUpdateShutdown,
  onDemoAddUsage,
  onResetUsage,
  parentPin,
  onUpdatePin,
  totalMinsUsed,
}) => {
  const [currPinInput, setCurrPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [pinError, setPinError] = useState('');

  const formatHours = (mins: number) => {
    return `${(mins / 60).toFixed(1).replace('.0', '')} hrs (${mins} min)`;
  };

  const isLimitReached = totalMinsUsed >= dailyLimit;

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currPinInput !== parentPin) {
      setPinError('Current PIN does not match.');
      setPinSuccess('');
      return;
    }
    if (newPinInput.length !== 4 || isNaN(Number(newPinInput))) {
      setPinError('New PIN must be exactly 4 digits.');
      setPinSuccess('');
      return;
    }

    onUpdatePin(newPinInput);
    setCurrPinInput('');
    setNewPinInput('');
    setPinError('');
    setPinSuccess('Parent PIN updated successfully!');
    setTimeout(() => setPinSuccess(''), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      {/* Primary Parent Limit & Auto-Shutdown Rule Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2">
          <Power className="w-5 h-5 text-rose-600" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Parent Screen-Time Limit & Auto-Shutdown
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Set the maximum screen time allowed for Maya. When usage reaches this limit, Maya&apos;s device powers down immediately and will not open until you authorize with your PIN.
        </p>

        <div className="space-y-6">
          {/* Daily Limit Slider */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Daily Usage Limit:</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {formatHours(dailyLimit)}
              </span>
            </div>

            <input
              type="range"
              min={60}
              max={360}
              step={15}
              value={dailyLimit}
              onChange={(e) => onUpdateLimit(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1 hr (60m)</span>
              <span>4 hrs (240m)</span>
              <span>6 hrs (360m)</span>
            </div>

            {/* Current status bar */}
            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-600">
                Maya&apos;s usage today: <strong className="text-slate-900 tabular-nums">{totalMinsUsed} min</strong>
              </span>

              {isLimitReached ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Limit reached (+{totalMinsUsed - dailyLimit}m over) — Device shut down!
                </span>
              ) : (
                <span className="text-emerald-600 font-bold">
                  {dailyLimit - totalMinsUsed} min remaining until shutdown
                </span>
              )}
            </div>
          </div>

          {/* Strict Auto-Shutdown Toggle */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shutdown.limitEnabled}
                onChange={(e) => onUpdateShutdown({ limitEnabled: e.target.checked })}
                className="w-4 h-4 rounded-sm text-indigo-600 accent-indigo-600 mt-0.5"
              />
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                  Enforce immediate device shutdown when limit is reached
                </span>
                <span className="text-xs text-slate-500 block mt-0.5 leading-relaxed">
                  Powers off the screen with a secure blackout overlay. The device will not open until the parent enters their password.
                </span>
              </div>
            </label>
          </div>

          {/* Quick preset & test actions */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
            <strong className="text-xs font-bold text-indigo-950 block">
              Test Instant Shutdown Rule:
            </strong>
            <p className="text-xs text-indigo-900/80 leading-relaxed">
              Click below to test time advancing or lower the limit to trigger immediate device shutdown.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => onDemoAddUsage(10)}
                className="px-3 py-1.5 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-900 rounded-lg text-xs font-semibold transition-colors"
              >
                +10m usage
              </button>
              <button
                type="button"
                onClick={() => onDemoAddUsage(30)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                +30m usage (triggers shutdown)
              </button>
              <button
                type="button"
                onClick={() => onUpdateLimit(Math.max(60, totalMinsUsed - 15))}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Set limit below usage ({Math.max(60, totalMinsUsed - 15)}m)
              </button>
              {onResetUsage && (
                <button
                  type="button"
                  onClick={onResetUsage}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  Reset to 140m (Child Sync)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bedtime Curfew Shut-off */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Nightly Bedtime Curfew
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Automatically shuts down Maya&apos;s device at a specific time every night regardless of remaining minutes.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <label className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-900 cursor-pointer">
            <input
              type="checkbox"
              checked={shutdown.clockEnabled}
              onChange={(e) => onUpdateShutdown({ clockEnabled: e.target.checked })}
              className="w-4 h-4 rounded-sm text-indigo-600 accent-indigo-600"
            />
            <span>Enable bedtime curfew auto-shutdown</span>
          </label>

          {shutdown.clockEnabled && (
            <div className="pl-6 pt-2 border-t border-slate-200/60 flex items-center gap-3">
              <span className="text-xs text-slate-600">Curfew time:</span>
              <input
                type="time"
                value={shutdown.clockTime}
                onChange={(e) => onUpdateShutdown({ clockTime: e.target.value })}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
              />
            </div>
          )}
        </div>
      </div>

      {/* Parent Password / PIN Security Management */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Parent Password / PIN Security
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Current master PIN is <strong>{parentPin}</strong>. This PIN is required to unlock the device after a shutdown and access parent mode.
        </p>

        <form onSubmit={handleSavePin} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Current PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={currPinInput}
                onChange={(e) => setCurrPinInput(e.target.value)}
                placeholder="Current 4-digit PIN"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                New PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="New 4-digit PIN"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest"
              />
            </div>
          </div>

          {pinError && (
            <p className="text-xs text-rose-600 font-medium">{pinError}</p>
          )}

          {pinSuccess && (
            <p className="text-xs text-emerald-600 font-medium">{pinSuccess}</p>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Update Parent Password / PIN
          </button>
        </form>
      </div>

      {/* Production Note */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Operating System Policy Enforcement:</strong> In production deployments, RINAYA communicates with Android Device Administration and Apple MDM restrictions to lock the physical hardware screen upon parent rule expiration.
        </p>
      </div>
    </div>
  );
};
