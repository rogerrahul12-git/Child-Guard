import React from 'react';
import { Shield, Smartphone, Lock, UserCheck, Sparkles, Download, Monitor, Phone } from 'lucide-react';
import { playAndroidSound, triggerHaptic } from '../utils/androidAudio';

interface HeaderProps {
  currentMode: 'child' | 'parent';
  onSelectMode: (mode: 'child' | 'parent') => void;
  isLocked: boolean;
  parentUnlocked: boolean;
  pendingRequestsCount: number;
  openAlertsCount: number;
  totalMinsUsed?: number;
  onOpenInstallModal?: () => void;
  isPhoneFrame?: boolean;
  onTogglePhoneFrame?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  isLocked,
  parentUnlocked,
  pendingRequestsCount,
  openAlertsCount,
  totalMinsUsed,
  onOpenInstallModal,
  isPhoneFrame,
  onTogglePhoneFrame,
}) => {
  const handleModeClick = (mode: 'child' | 'parent') => {
    playAndroidSound('tap');
    triggerHaptic(15);
    onSelectMode(mode);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight block">
              RINAYA <span className="text-indigo-600 text-xs sm:text-sm font-semibold ml-1">Android</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Parental Guardian & Mentoring
            </span>
          </div>
        </div>

        {/* Zone 2: Context status (Quiet unboxed text) */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            Galaxy Tab A8 / Android 14
          </span>
          {totalMinsUsed !== undefined && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-semibold text-slate-800 tabular-nums bg-slate-100 px-2 py-0.5 rounded-md">
                Today: {totalMinsUsed} min
              </span>
            </>
          )}
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="font-medium">
            Status: {isLocked ? (
              <span className="text-rose-600 font-semibold">Switched Off</span>
            ) : (
              <span className="text-emerald-600 font-semibold">Protected</span>
            )}
          </span>
        </div>

        {/* Zone 3: Android Action Controls & Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Install on Android Button */}
          {onOpenInstallModal && (
            <button
              onClick={() => {
                playAndroidSound('tap');
                triggerHaptic(20);
                onOpenInstallModal();
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs whitespace-nowrap active:scale-95"
              title="Install RINAYA as native Android App / WebAPK"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="hidden sm:inline">Install</span> Android App
            </button>
          )}

          {/* Toggle Phone Frame (on desktop/tablet) */}
          {onTogglePhoneFrame && (
            <button
              onClick={() => {
                playAndroidSound('tap');
                onTogglePhoneFrame();
              }}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              title={isPhoneFrame ? 'Switch to Full Screen View' : 'Switch to Android Phone Simulation View'}
            >
              {isPhoneFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-slate-500" />
                  <span>Desktop</span>
                </>
              ) : (
                <>
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Phone Frame</span>
                </>
              )}
            </button>
          )}

          {/* Child / Parent Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => handleModeClick('child')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                currentMode === 'child'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Child Mode
            </button>
            <button
              onClick={() => handleModeClick('parent')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentMode === 'parent'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3 h-3" />
              Parent Mode
              {(openAlertsCount > 0 || pendingRequestsCount > 0) && currentMode !== 'parent' && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

