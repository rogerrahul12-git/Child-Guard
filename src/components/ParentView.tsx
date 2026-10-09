import React, { useState } from 'react';
import {
  AppItem,
  ContentCategory,
  SafetyAlert,
  ShutdownConfig,
} from '../types';
import { OverviewTab } from './OverviewTab';
import { ContentIntelligenceTab } from './ContentIntelligenceTab';
import { ScreenTimeTab } from './ScreenTimeTab';
import { AppsManagementTab } from './AppsManagementTab';
import { SafetyAlertsTab } from './SafetyAlertsTab';
import { MentorGuideTab } from './MentorGuideTab';
import { SettingsTab } from './SettingsTab';
import {
  Lock,
  KeyRound,
  LayoutDashboard,
  Brain,
  Timer,
  Smartphone,
  ShieldAlert,
  Users,
  Settings,
  ShieldCheck,
  SmartphoneNfc
} from 'lucide-react';
import mayaAvatarUrl from '../assets/images/child_maya_avatar_1791525308280.jpg';
import { playAndroidSound, triggerHaptic } from '../utils/androidAudio';

interface ParentViewProps {
  isUnlocked: boolean;
  onUnlock: (pin: string) => boolean;
  parentPin: string;
  apps: AppItem[];
  categories: ContentCategory[];
  weekMinutes: number[];
  dailyLimit: number;
  totalMinsUsed: number;
  riskScore: number;
  shutdown: ShutdownConfig;
  removeRequests: number[];
  alerts: SafetyAlert[];
  onApproveRemoval: (appId: number) => void;
  onDeclineRemoval: (appId: number) => void;
  onRemoveApp: (appId: number) => void;
  onAddApp: (newApp: AppItem) => void;
  onMarkReviewed: (alertId: number) => void;
  onAddAlert: (newAlert: SafetyAlert) => void;
  onUpdateLimit: (val: number) => void;
  onUpdateShutdown: (config: Partial<ShutdownConfig>) => void;
  onDemoAddUsage: (mins: number) => void;
  onUpdatePin: (newPin: string) => void;
  onLockSession?: () => void;
  onResetUsage?: () => void;
}

export const ParentView: React.FC<ParentViewProps> = ({
  isUnlocked,
  onUnlock,
  parentPin,
  apps,
  categories,
  weekMinutes,
  dailyLimit,
  totalMinsUsed,
  riskScore,
  shutdown,
  removeRequests,
  alerts,
  onApproveRemoval,
  onDeclineRemoval,
  onRemoveApp,
  onAddApp,
  onMarkReviewed,
  onAddAlert,
  onUpdateLimit,
  onUpdateShutdown,
  onDemoAddUsage,
  onUpdatePin,
  onLockSession,
  onResetUsage,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'content' | 'addiction' | 'apps' | 'alerts' | 'guide' | 'settings'
  >('overview');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [selectedAlertForGuidance, setSelectedAlertForGuidance] = useState<SafetyAlert | null>(null);

  React.useEffect(() => {
    if (!isUnlocked) {
      setPinInput('');
      setPinError('');
    }
  }, [isUnlocked]);

  const pendingRequestsCount = removeRequests.length;
  const openAlertsCount = alerts.filter((a) => !a.reviewed).length;
  const avgDailyMins = Math.round(
    weekMinutes.reduce((sum, val) => sum + val, 0) / weekMinutes.length
  );

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onUnlock(pinInput)) {
      playAndroidSound('unlock');
      triggerHaptic(40);
      setPinInput('');
      setPinError('');
    } else {
      playAndroidSound('alert');
      triggerHaptic([80, 40, 80]);
      setPinError('Incorrect PIN. Please try again.');
    }
  };

  const handleQuickDemoFill = () => {
    setPinInput(parentPin);
    playAndroidSound('unlock');
    triggerHaptic(40);
    onUnlock(parentPin);
  };

  const handleSelectForMentoring = (alert: SafetyAlert) => {
    setSelectedAlertForGuidance(alert);
    setActiveTab('guide');
  };

  // If parent hasn't entered PIN yet in this session
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 animate-fade-in">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 mx-auto flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Parent Authorization
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
            Enter your 4-digit guardian PIN to manage Maya&apos;s limits, apps, and review behavioral intelligence.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder="••••"
                className="w-40 text-center tracking-widest font-mono text-2xl py-2.5 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-600 font-semibold">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              Unlock Guardian Dashboard
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2"
            >
              One-Click Demo Unlock (PIN: {parentPin})
            </button>
            {onLockSession && (
              <button
                type="button"
                onClick={onLockSession}
                className="text-xs text-slate-500 hover:text-slate-700 transition-colors pt-1"
              >
                ← Return to Child Mode
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Profile Header Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={mayaAvatarUrl}
            alt="Maya"
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Maya&apos;s Guardian Dashboard
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                Age 11 · Grade 6
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>Device: Samsung Galaxy Tab A8</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 font-semibold">Active & Synced 3s ago</span>
              <span aria-hidden="true">·</span>
              <span>Parent Mentoring Profile</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto text-xs text-slate-500">
          {/* Live Child-Sync Screen Time Badge */}
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
            <Timer className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tabular-nums">
                  {totalMinsUsed} min
                </span>
                <span className="text-slate-500">
                  ({Math.floor(totalMinsUsed / 60)}h {totalMinsUsed % 60}m)
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-1 py-0.2 rounded">
                  Live Child Sync
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">
                Matches Child Mode · Goal: {dailyLimit}m
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hidden lg:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">Autonomous Telemetry</span>
          </div>

          {onLockSession && (
            <button
              onClick={onLockSession}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors flex items-center gap-1.5"
              title="Lock Parent Session & Return to Child Mode"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Lock Session
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs (Zero-Pill Discipline with functional Segmented Buttons) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Overview
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'content'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          Content Intelligence
        </button>

        <button
          onClick={() => setActiveTab('addiction')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'addiction'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          Screen Time Intelligence
        </button>

        <button
          onClick={() => setActiveTab('apps')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'apps'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Apps
          {pendingRequestsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'alerts'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Safety Alerts
          {openAlertsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
              {openAlertsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'guide'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Mentor Guide
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          Settings
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <OverviewTab
          totalMinsUsed={totalMinsUsed}
          dailyLimit={dailyLimit}
          avgDailyMins={avgDailyMins}
          riskScore={riskScore}
          openAlertsCount={openAlertsCount}
          shutdown={shutdown}
          alerts={alerts}
          onNavigateTab={(t: any) => setActiveTab(t)}
        />
      )}

      {activeTab === 'content' && (
        <ContentIntelligenceTab categories={categories} />
      )}

      {activeTab === 'addiction' && (
        <ScreenTimeTab
          weekMinutes={weekMinutes}
          dailyLimit={dailyLimit}
          riskScore={riskScore}
          totalMinsUsed={totalMinsUsed}
        />
      )}

      {activeTab === 'apps' && (
        <AppsManagementTab
          apps={apps}
          removeRequests={removeRequests}
          onApproveRemoval={onApproveRemoval}
          onDeclineRemoval={onDeclineRemoval}
          onRemoveApp={onRemoveApp}
          onAddApp={onAddApp}
        />
      )}

      {activeTab === 'alerts' && (
        <SafetyAlertsTab
          alerts={alerts}
          onMarkReviewed={onMarkReviewed}
          onSelectForMentoring={handleSelectForMentoring}
          onAddAlert={onAddAlert}
        />
      )}

      {activeTab === 'guide' && (
        <MentorGuideTab
          totalMinsUsed={totalMinsUsed}
          selectedAlertForGuidance={selectedAlertForGuidance}
          onClearSelectedAlert={() => setSelectedAlertForGuidance(null)}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsTab
          dailyLimit={dailyLimit}
          onUpdateLimit={onUpdateLimit}
          shutdown={shutdown}
          onUpdateShutdown={onUpdateShutdown}
          onDemoAddUsage={onDemoAddUsage}
          parentPin={parentPin}
          onUpdatePin={onUpdatePin}
          totalMinsUsed={totalMinsUsed}
          onResetUsage={onResetUsage}
        />
      )}
    </div>
  );
};
