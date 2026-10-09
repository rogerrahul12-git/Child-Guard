import React from 'react';
import { X, Trash2, ShieldCheck, Smartphone, ExternalLink } from 'lucide-react';
import { AppItem } from '../types';
import { playAndroidSound, triggerHaptic } from '../utils/androidAudio';

interface AndroidRecentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppItem[];
  onSelectApp?: (app: AppItem) => void;
}

export const AndroidRecentsDrawer: React.FC<AndroidRecentsDrawerProps> = ({
  isOpen,
  onClose,
  apps,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    playAndroidSound('tap');
    triggerHaptic(15);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg mx-auto bg-slate-900 text-white rounded-t-3xl border-t border-slate-700 shadow-2xl p-5 pb-8 space-y-4 animate-in slide-in-from-bottom duration-200"
      >
        {/* Drawer Handle & Header */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full mb-3" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-100">Android Recent Tasks</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Running Tasks Horizontal Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar snap-x">
          {apps.map((app) => (
            <div
              key={app.id}
              className="min-w-[190px] bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 snap-center flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: app.color }}
                  >
                    {app.iconLetter}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white truncate max-w-[95px]">{app.name}</h4>
                    <span className="text-[10px] text-slate-400 block">{app.category}</span>
                  </div>
                </div>
              </div>

              {/* App Preview Card */}
              <div className="bg-slate-950/70 rounded-xl p-3 my-2 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">Today&apos;s Active Time</span>
                <span className="text-base font-bold text-white font-mono">{app.mins} min</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3 h-3" /> Supervised
                </span>
                <span className="text-slate-500 font-mono text-[10px]">PID: 28{app.id}0</span>
              </div>
            </div>
          ))}
        </div>

        {/* Android Drawer Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px]">
            {apps.length} active processes monitored
          </span>
          <button
            onClick={handleClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Return to App
          </button>
        </div>
      </div>
    </div>
  );
};
