import React, { useState, useEffect } from 'react';
import { Power, KeyRound, AlertTriangle, Clock, ShieldAlert, Smartphone } from 'lucide-react';
import { playAndroidSound, triggerHaptic } from '../utils/androidAudio';

interface LockOverlayProps {
  reason: string;
  onUnlock: (pin: string, extensionMins: number) => boolean;
  parentPin: string;
  totalMinsUsed: number;
  dailyLimit: number;
}

export const LockOverlay: React.FC<LockOverlayProps> = ({
  reason,
  onUnlock,
  parentPin,
  totalMinsUsed,
  dailyLimit,
}) => {
  const [pin, setPin] = useState('');
  const [extension, setExtension] = useState<number>(30);
  const [error, setError] = useState('');

  useEffect(() => {
    // Play shutdown tone and trigger long haptic buzz upon screen lock
    playAndroidSound('shutdown');
    triggerHaptic([200, 100, 200]);
  }, []);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onUnlock(pin, extension)) {
      playAndroidSound('unlock');
      triggerHaptic(50);
      setPin('');
      setError('');
    } else {
      playAndroidSound('alert');
      triggerHaptic([100, 50, 100]);
      setError('Incorrect parent password/PIN. Device remains locked.');
    }
  };

  const handleQuickDemoUnlock = () => {
    setPin(parentPin);
    playAndroidSound('unlock');
    triggerHaptic(50);
    onUnlock(parentPin, extension);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md select-none animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Device Switched Off"
    >
      <div className="max-w-md w-full text-center bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Pulsing Power Icon */}
        <div className="w-20 h-20 rounded-full bg-slate-950 border-2 border-rose-600/80 mx-auto flex items-center justify-center text-rose-500 mb-5 shadow-lg shadow-rose-950/40">
          <Power className="w-10 h-10 animate-pulse text-rose-500" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Device Switched Off
        </h1>

        <div className="bg-slate-950/80 border border-rose-900/50 rounded-2xl p-4 my-4 text-left">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Parent Time Limit Triggered</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            {reason || `Daily usage threshold reached: ${totalMinsUsed}m used of ${dailyLimit}m limit.`}
          </p>
        </div>

        <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-6 leading-relaxed">
          Your parent has locked this device. The screen will remain shut down until your parent authorizes an unlock with their master PIN.
        </p>

        {/* Parent Unlock Section */}
        <div className="border-t border-slate-800 pt-5 mt-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-3">
            Parent Authorization Required
          </span>

          <form onSubmit={handleUnlock} className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="4-DIGIT PIN"
                className="w-full sm:w-36 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-center text-lg font-mono tracking-widest text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />

              <select
                value={extension}
                onChange={(e) => setExtension(Number(e.target.value))}
                className="w-full sm:w-auto bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={15}>+15 min extension</option>
                <option value={30}>+30 min extension</option>
                <option value={60}>+60 min extension</option>
                <option value={120}>+2 hours extension</option>
              </select>

              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
              >
                <KeyRound className="w-4 h-4" />
                Unlock
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-semibold pt-1">{error}</p>
            )}
          </form>

          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <button
              type="button"
              onClick={handleQuickDemoUnlock}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              One-Click Demo Unlock (PIN: {parentPin} with +{extension}m)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
