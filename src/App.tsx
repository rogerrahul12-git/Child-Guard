import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_APPS,
  INITIAL_CATEGORIES,
  INITIAL_WEEK_MINUTES,
  INITIAL_ALERTS,
  INITIAL_QUIZ,
  INITIAL_SHUTDOWN,
} from './data/mockData';
import { AppItem, SafetyAlert, ShutdownConfig } from './types';
import { Header } from './components/Header';
import { ChildView } from './components/ChildView';
import { ParentView } from './components/ParentView';
import { LockOverlay } from './components/LockOverlay';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidNavBar } from './components/AndroidNavBar';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { AndroidRecentsDrawer } from './components/AndroidRecentsDrawer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { usePWAInstall } from './hooks/usePWAInstall';
import { playAndroidSound, triggerHaptic } from './utils/androidAudio';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'child' | 'parent'>('child');
  const [parentUnlocked, setParentUnlocked] = useState<boolean>(false);
  const [parentPin, setParentPin] = useState<string>('1234');

  // Application State
  const [dailyLimit, setDailyLimit] = useState<number>(180); // Default 180m (3 hrs) goal, Maya has 40m remaining out of 140m used
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [categories] = useState(INITIAL_CATEGORIES);
  const [weekMinutes, setWeekMinutes] = useState<number[]>(INITIAL_WEEK_MINUTES);
  const [alerts, setAlerts] = useState<SafetyAlert[]>(INITIAL_ALERTS);
  const [quizQuestions] = useState(INITIAL_QUIZ);
  const [removeRequests, setRemoveRequests] = useState<number[]>([]);
  const [shutdown, setShutdown] = useState<ShutdownConfig>({
    ...INITIAL_SHUTDOWN,
    limitMinutes: 180,
  });

  // Android & PWA App State
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isRecentsOpen, setIsRecentsOpen] = useState<boolean>(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Total screen time used today
  const totalMinsUsed = useMemo(() => {
    return apps.reduce((sum, app) => sum + app.mins, 0);
  }, [apps]);

  // Keep today's (Sunday / last index) usage synchronized with the apps sum
  useEffect(() => {
    setWeekMinutes((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = totalMinsUsed;
      return copy;
    });
  }, [totalMinsUsed]);

  // Check if current time is past hh:mm
  const isNowPast = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes() >= h * 60 + m;
  };

  // Evaluate shutdown trigger: immediately shut down when usage meets or exceeds parent limit
  useEffect(() => {
    if (shutdown.locked) return;

    if (shutdown.limitEnabled && totalMinsUsed >= dailyLimit) {
      setShutdown((prev) => ({
        ...prev,
        locked: true,
        reason: `Parent daily screen-time limit of ${dailyLimit} minutes (${(dailyLimit / 60).toFixed(1)} hrs) reached. Current usage is ${totalMinsUsed} min.`,
      }));
      return;
    }

    if (shutdown.clockEnabled && !shutdown.clockOverride && isNowPast(shutdown.clockTime)) {
      setShutdown((prev) => ({
        ...prev,
        locked: true,
        reason: `Scheduled bedtime curfew (${shutdown.clockTime}) reached. Device switched off for the night.`,
      }));
      return;
    }
  }, [totalMinsUsed, dailyLimit, shutdown.limitEnabled, shutdown.clockEnabled, shutdown.clockTime, shutdown.clockOverride, shutdown.locked]);

  // Periodic check for bedtime clock
  useEffect(() => {
    const timer = setInterval(() => {
      if (!shutdown.locked && shutdown.clockEnabled && !shutdown.clockOverride && isNowPast(shutdown.clockTime)) {
        setShutdown((prev) => ({
          ...prev,
          locked: true,
          reason: `Scheduled bedtime curfew (${shutdown.clockTime}) reached. Device switched off for the night.`,
        }));
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [shutdown.locked, shutdown.clockEnabled, shutdown.clockOverride, shutdown.clockTime]);

  // Handlers
  const handleSelectMode = (mode: 'child' | 'parent') => {
    if (mode === 'parent') {
      // Every time parent mode is clicked, lock session and ask for PIN
      setParentUnlocked(false);
    } else {
      // Switching back to child mode also revokes parent session
      setParentUnlocked(false);
    }
    setCurrentMode(mode);
  };

  const handleLockParentSession = () => {
    setParentUnlocked(false);
    setCurrentMode('child');
  };

  const handleUnlockParentSession = (pin: string) => {
    if (pin === parentPin) {
      setParentUnlocked(true);
      return true;
    }
    return false;
  };

  const handleUnlockDeviceLock = (pin: string, extensionMins = 30) => {
    if (pin === parentPin) {
      const newLimit = totalMinsUsed + extensionMins;
      setDailyLimit(newLimit);
      setShutdown((prev) => ({
        ...prev,
        locked: false,
        reason: '',
        limitMinutes: newLimit,
        clockOverride: true,
      }));
      return true;
    }
    return false;
  };

  const handleRequestRemoval = (appId: number) => {
    if (!removeRequests.includes(appId)) {
      setRemoveRequests((prev) => [...prev, appId]);
    }
  };

  const handleApproveRemoval = (appId: number) => {
    setApps((prev) => prev.filter((a) => a.id !== appId));
    setRemoveRequests((prev) => prev.filter((id) => id !== appId));
  };

  const handleDeclineRemoval = (appId: number) => {
    setRemoveRequests((prev) => prev.filter((id) => id !== appId));
  };

  const handleRemoveApp = (appId: number) => {
    setApps((prev) => prev.filter((a) => a.id !== appId));
    setRemoveRequests((prev) => prev.filter((id) => id !== appId));
  };

  const handleAddApp = (newApp: AppItem) => {
    setApps((prev) => [newApp, ...prev]);
  };

  const handleMarkReviewed = (alertId: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, reviewed: true } : a))
    );
  };

  const handleAddAlert = (newAlert: SafetyAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleUpdateLimit = (val: number) => {
    setDailyLimit(val);
    setShutdown((prev) => ({
      ...prev,
      limitMinutes: val,
      clockOverride: false,
    }));

    // If auto-shutdown is enabled and totalMinsUsed >= val, shut down IMMEDIATELY!
    if (shutdown.limitEnabled && totalMinsUsed >= val) {
      setShutdown((prev) => ({
        ...prev,
        limitMinutes: val,
        locked: true,
        reason: `Parent daily screen-time limit of ${val} minutes (${(val / 60).toFixed(1)} hrs) reached. Current usage is ${totalMinsUsed} min.`,
      }));
    }
  };

  const handleUpdateShutdown = (config: Partial<ShutdownConfig>) => {
    setShutdown((prev) => {
      const updated = {
        ...prev,
        ...config,
        clockOverride: false,
      };
      if (updated.limitEnabled && totalMinsUsed >= dailyLimit) {
        updated.locked = true;
        updated.reason = `Parent daily screen-time limit of ${dailyLimit} minutes reached. Current usage is ${totalMinsUsed} min.`;
      }
      return updated;
    });
  };

  const handleDemoAddUsage = (mins: number) => {
    setApps((prev) => {
      if (prev.length === 0) return prev;
      return prev.map((app, idx) => (idx === 0 ? { ...app, mins: app.mins + mins } : app));
    });
  };

  const handleResetUsage = () => {
    setApps([
      { id: 1, name: "YouTube Shorts", mins: 48, category: "Entertainment", color: "#ef4444", iconLetter: "YT", riskRating: "High" },
      { id: 2, name: "BlockWorld",     mins: 38, category: "Gaming",         color: "#22c55e", iconLetter: "BW", riskRating: "Moderate" },
      { id: 3, name: "LearnPath",      mins: 26, category: "Education",      color: "#f59e0b", iconLetter: "LP", riskRating: "Low" },
      { id: 4, name: "Instagram",      mins: 16, category: "Social Media",   color: "#ec4899", iconLetter: "IG", riskRating: "High" },
      { id: 5, name: "ChatLite",       mins: 12, category: "Social Media",   color: "#3b82f6", iconLetter: "CL", riskRating: "Moderate" }
    ]);
    setShutdown((prev) => ({ ...prev, locked: false, reason: '' }));
  };

  const handleUpdatePin = (newPin: string) => {
    setParentPin(newPin);
  };

  // Android Navigation Actions
  const handleAndroidBack = () => {
    if (isRecentsOpen) {
      setIsRecentsOpen(false);
      return;
    }
    if (currentMode === 'parent') {
      setCurrentMode('child');
      setParentUnlocked(false);
      return;
    }
    triggerHaptic(20);
  };

  const handleAndroidHome = () => {
    if (isRecentsOpen) {
      setIsRecentsOpen(false);
    }
    setCurrentMode('child');
    setParentUnlocked(false);
    triggerHaptic(25);
  };

  const handleAndroidRecents = () => {
    setIsRecentsOpen((prev) => !prev);
  };

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-900 selection:bg-indigo-100 flex flex-col justify-center items-center ${isPhoneFrame ? 'py-4 sm:py-8' : ''}`}>
      {/* Outer Phone Shell (Enabled when isPhoneFrame is true on desktop) */}
      <div
        className={`w-full flex flex-col transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[430px] min-h-[880px] bg-white rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] ring-10 ring-slate-800 border-4 border-slate-700 overflow-hidden relative'
            : 'min-h-screen bg-slate-50'
        }`}
      >
        {/* Android Native Status Bar */}
        <AndroidStatusBar
          totalMinsUsed={totalMinsUsed}
          dailyLimit={dailyLimit}
          isLocked={shutdown.locked}
        />

        {/* Top Header */}
        <Header
          currentMode={currentMode}
          onSelectMode={handleSelectMode}
          isLocked={shutdown.locked}
          parentUnlocked={parentUnlocked}
          pendingRequestsCount={removeRequests.length}
          openAlertsCount={alerts.filter((a) => !a.reviewed).length}
          totalMinsUsed={totalMinsUsed}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        />

        {/* Main Content Area */}
        <main className={`flex-1 w-full mx-auto ${isPhoneFrame ? 'px-3 pt-4 max-w-full' : 'max-w-6xl px-4 sm:px-6 pt-6 sm:pt-8'}`}>
          {currentMode === 'child' ? (
            <ChildView
              apps={apps}
              dailyLimit={dailyLimit}
              totalMinsUsed={totalMinsUsed}
              quizQuestions={quizQuestions}
              onAddUsage={handleDemoAddUsage}
              onResetUsage={handleResetUsage}
            />
          ) : (
            <ParentView
              isUnlocked={parentUnlocked}
              onUnlock={handleUnlockParentSession}
              parentPin={parentPin}
              apps={apps}
              categories={categories}
              weekMinutes={weekMinutes}
              dailyLimit={dailyLimit}
              totalMinsUsed={totalMinsUsed}
              riskScore={78}
              shutdown={shutdown}
              removeRequests={removeRequests}
              alerts={alerts}
              onApproveRemoval={handleApproveRemoval}
              onDeclineRemoval={handleDeclineRemoval}
              onRemoveApp={handleRemoveApp}
              onAddApp={handleAddApp}
              onMarkReviewed={handleMarkReviewed}
              onAddAlert={handleAddAlert}
              onUpdateLimit={handleUpdateLimit}
              onUpdateShutdown={handleUpdateShutdown}
              onDemoAddUsage={handleDemoAddUsage}
              onUpdatePin={handleUpdatePin}
              onLockSession={handleLockParentSession}
              onResetUsage={handleResetUsage}
            />
          )}
        </main>

        {/* Full-Screen Device Switch-Off Overlay */}
        {shutdown.locked && (
          <LockOverlay
            reason={shutdown.reason}
            onUnlock={handleUnlockDeviceLock}
            parentPin={parentPin}
            totalMinsUsed={totalMinsUsed}
            dailyLimit={dailyLimit}
          />
        )}

        {/* Android Native Navigation Bar (Back, Home, Recents) */}
        <AndroidNavBar
          onBack={handleAndroidBack}
          onHome={handleAndroidHome}
          onRecents={handleAndroidRecents}
        />

        {/* Footnote / Disclaimer */}
        {!isPhoneFrame && (
          <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-400">
            <div className="max-w-6xl mx-auto px-4">
              <p>
                RINAYA Guardian AI Platform · Transforming child digital wellness from surveillance to constructive mentoring.
              </p>
            </div>
          </footer>
        )}
      </div>

      {/* Android Recent Apps Switcher Drawer */}
      <AndroidRecentsDrawer
        isOpen={isRecentsOpen}
        onClose={() => setIsRecentsOpen(false)}
        apps={apps}
      />

      {/* Android Installation & APK Modal */}
      <AndroidInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        onInstall={install}
      />

      {/* PWA Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
}
