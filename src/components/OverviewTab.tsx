import React from 'react';
import { SafetyAlert, ShutdownConfig } from '../types';
import {
  Brain,
  Timer,
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  Users,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  BookOpen
} from 'lucide-react';

interface OverviewTabProps {
  totalMinsUsed: number;
  dailyLimit: number;
  avgDailyMins: number;
  riskScore: number;
  openAlertsCount: number;
  shutdown: ShutdownConfig;
  alerts: SafetyAlert[];
  onNavigateTab: (tabId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  totalMinsUsed,
  dailyLimit,
  avgDailyMins,
  riskScore,
  openAlertsCount,
  shutdown,
  alerts,
  onNavigateTab,
}) => {
  const formatMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const isOver = totalMinsUsed > dailyLimit;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Philosophy Loop: 1 Monitor -> 2 Analyze -> 3 Understand -> 4 Mentor */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              How RINAYA Protects & Guides Maya
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Shifting family dynamics from surveillance friction to constructive mentoring.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md self-start sm:self-auto">
            Autonomous Guardian Loop
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-400 block mb-1">01. MONITOR</span>
            <span className="text-sm font-semibold text-slate-900 block">Behavioral Signals</span>
            <span className="text-xs text-slate-500 mt-1 block">Scroll speed, hours & chat safety</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-400 block mb-1">02. ANALYZE</span>
            <span className="text-sm font-semibold text-slate-900 block">Content Depth</span>
            <span className="text-xs text-slate-500 mt-1 block">STEM vs dopamine loops</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-400 block mb-1">03. UNDERSTAND</span>
            <span className="text-sm font-semibold text-slate-900 block">Emotional Wellbeing</span>
            <span className="text-xs text-slate-500 mt-1 block">Detects stress & late-night fatigue</span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <span className="text-xs font-bold text-indigo-600 block mb-1">04. MENTOR</span>
            <span className="text-sm font-semibold text-indigo-950 block">Parent Coaching</span>
            <span className="text-xs text-indigo-700/80 mt-1 block">Turns alerts into conversation starters</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Today's Screen Time (Live Child Sync) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">
              Today&apos;s Screen Time
            </span>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
              Child Sync
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {totalMinsUsed} min
            </span>
            <span className="text-xs font-bold text-slate-500">
              ({formatMins(totalMinsUsed)})
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span className={`tabular-nums font-semibold ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
              {isOver ? `+${totalMinsUsed - dailyLimit}m over` : `${dailyLimit - totalMinsUsed}m left`}
            </span>
            <span aria-hidden="true">·</span>
            <span>of {dailyLimit}m goal (7d avg: {avgDailyMins}m)</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Addiction Risk Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 tabular-nums">
              {riskScore}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-2 font-medium">
            <span>High Risk</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Short feeds & late hours</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Unreviewed Safety Alerts
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 tabular-nums">
              {openAlertsCount}
            </span>
            <span className="text-xs text-slate-500">pending review</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-700 mt-2">
            <button
              onClick={() => onNavigateTab('alerts')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
            >
              Review alerts now →
            </button>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Device State
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-xl font-extrabold ${
                shutdown.locked ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {shutdown.locked ? 'Switched Off' : 'Active (Online)'}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-2 truncate">
            {shutdown.limitEnabled ? `Cap: ${shutdown.limitMinutes}m` : 'No daily cap'}
            {shutdown.clockEnabled && ` · Off at ${shutdown.clockTime}`}
          </div>
        </div>
      </div>

      {/* Research & Context Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Why Mentoring Matters: Research Benchmark
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums block mb-1">
              6.5h+
            </span>
            <span className="text-xs font-semibold text-slate-700 block">
              Average daily recreational screen time
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              For adolescents aged 11–14 (Common Sense Media 2023)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums block mb-1">
              45%
            </span>
            <span className="text-xs font-semibold text-slate-700 block">
              Children hide cyber risks from parents
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              Fearing punitive device confiscation (McAfee Cyberbullying Study)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums block mb-1">
              2.2×
            </span>
            <span className="text-xs font-semibold text-slate-700 block">
              India&apos;s youth cyberbullying rate vs global
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              Urging proactive emotional guidance over rigid blockers
            </span>
          </div>
        </div>
      </div>

      {/* The 6 Core AI Capabilities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              The Six RINAYA Intelligence Modules
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Deep behavioral comprehension operating in the background on Maya&apos;s device.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1 */}
          <div
            onClick={() => onNavigateTab('content')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Content Intelligence</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Classifies what Maya watches—distinguishing high-reward dopamine loops from constructive STEM building.
            </p>
          </div>

          {/* 2 */}
          <div
            onClick={() => onNavigateTab('addiction')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Timer className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Addiction Detection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Monitors rapid short-video swiping velocity, bedtime boundary violations, and compulsion spikes.
            </p>
          </div>

          {/* 3 */}
          <div
            onClick={() => onNavigateTab('alerts')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Emotional Wellbeing Analysis</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Understands tone shifts, late-night exhaustion cues, and peer friction signals in digital interactions.
            </p>
          </div>

          {/* 4 */}
          <div
            onClick={() => onNavigateTab('alerts')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Cyber Safety Detection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Quarantines unknown adult DM inquiries, blocks phone/address disclosure, and spots phishing skins.
            </p>
          </div>

          {/* 5 */}
          <div
            onClick={() => onNavigateTab('content')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Learning Potential Analysis</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Translates Minecraft sandbox architecture and tutorial viewing into engineering & coding pathways.
            </p>
          </div>

          {/* 6 */}
          <div
            onClick={() => onNavigateTab('guide')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Parent Mentoring Assistant</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates evening discussion scripts so parents can guide children with warmth and constructive boundaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
