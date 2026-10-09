import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Shield, ChevronDown, Bell, Clock, Sparkles } from 'lucide-react';

interface AndroidStatusBarProps {
  totalMinsUsed: number;
  dailyLimit: number;
  isLocked: boolean;
  onOpenShade?: () => void;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  totalMinsUsed,
  dailyLimit,
  isLocked,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotificationDrawer, setShowNotificationDrawer] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-40">
      {/* Android Top System Bar */}
      <div 
        onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
        className="w-full bg-slate-900 text-slate-100 text-[11px] font-semibold px-4 py-1.5 flex items-center justify-between select-none cursor-pointer border-b border-slate-800 transition hover:bg-slate-800/90"
        title="Tap to pull down Android Notification Shade"
      >
        {/* Left: Clock & Guardian Active Icon */}
        <div className="flex items-center gap-2">
          <span className="tabular-nums font-mono text-xs">{currentTime || '10:45'}</span>
          <div className="flex items-center gap-1 text-indigo-400">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] bg-indigo-950/80 text-cyan-300 px-1 py-0.2 rounded border border-cyan-800/60 font-mono">
              RINAYA
            </span>
          </div>
        </div>

        {/* Center Punch-hole Camera indicator */}
        <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 shrink-0" />

        {/* Right: Signals & Battery */}
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-[10px] text-slate-400 font-mono">5G</span>
          <Wifi className="w-3.5 h-3.5 text-slate-300" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono">89%</span>
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Android Notification Shade Drawer */}
      {showNotificationDrawer && (
        <div className="absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md text-slate-100 p-4 border-b border-slate-700 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Bell className="w-3.5 h-3.5 text-indigo-400" /> Android System Notifications
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowNotificationDrawer(false); }}
              className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
            >
              Close
            </button>
          </div>

          <div className="space-y-2">
            <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">RINAYA Device Supervisor</span>
                  <span className="text-[10px] text-slate-500 font-mono">Live</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Screen Time: <strong className="text-white">{totalMinsUsed}m</strong> / {dailyLimit}m · {dailyLimit - totalMinsUsed > 0 ? `${dailyLimit - totalMinsUsed}m remaining` : 'Limit Reached'}
                </p>
                <div className="mt-1.5 w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      totalMinsUsed >= dailyLimit ? 'bg-rose-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, (totalMinsUsed / dailyLimit) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Samsung Galaxy Knox · Active Protection
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">ENFORCED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
