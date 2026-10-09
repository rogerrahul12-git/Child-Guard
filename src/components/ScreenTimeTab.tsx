import React, { useState } from 'react';
import { DAYS_OF_WEEK } from '../data/mockData';
import { Timer, Moon, Zap, Flame, Info, CheckCircle2, BedDouble, AlertCircle } from 'lucide-react';

interface ScreenTimeTabProps {
  weekMinutes: number[];
  dailyLimit: number;
  riskScore: number;
  totalMinsUsed: number;
}

export const ScreenTimeTab: React.FC<ScreenTimeTabProps> = ({
  weekMinutes,
  dailyLimit,
  riskScore,
  totalMinsUsed,
}) => {
  const [activeDayIdx, setActiveDayIdx] = useState<number>(6); // Default Sunday (today)
  const [bedtimeAgreement, setBedtimeAgreement] = useState(false);

  // Make sure today's day (Sunday, index 6) dynamically matches totalMinsUsed
  const displayWeekMins = [...weekMinutes];
  if (displayWeekMins.length > 6) {
    displayWeekMins[6] = totalMinsUsed;
  }

  const maxVal = Math.max(...displayWeekMins, dailyLimit) * 1.15;
  const currentMins = activeDayIdx === 6 ? totalMinsUsed : displayWeekMins[activeDayIdx];
  const isCurrentOver = currentMins > dailyLimit;

  // Conic gradient for the risk ring
  const riskDeg = Math.round(riskScore * 3.6);
  const ringBackground = `conic-gradient(#e11d48 ${riskDeg}deg, #f1f5f9 0deg)`;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Risk Score & 4 Behavioral Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Ring Gauge */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-4 self-start">
            <Timer className="w-4 h-4 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Addiction Vulnerability</h2>
          </div>

          <div
            className="w-36 h-36 rounded-full flex items-center justify-center shadow-inner my-2"
            style={{ background: ringBackground }}
          >
            <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center shadow-xs">
              <span className="text-3xl font-black text-rose-600 tabular-nums">
                {riskScore}
              </span>
              <span className="text-[11px] font-bold text-slate-400">/ 100 Risk</span>
            </div>
          </div>

          <div className="mt-3">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
              High Compulsion Level
            </span>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
              Calculated dynamically from night hours, swipe frequency, and binge streaks.
            </p>
          </div>
        </div>

        {/* 4 Signals Grid */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Core Behavioral Indicators
              </h2>
              <span className="text-xs text-slate-400 font-medium">Real-Time Telemetry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Signal 1 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500">Today&apos;s Screen Duration</span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    {Math.floor(totalMinsUsed / 60)}h {totalMinsUsed % 60}m
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  <strong className="text-slate-900 tabular-nums">{totalMinsUsed} min</strong> used today vs {dailyLimit}m goal (matches Child Mode)
                </div>
              </div>

              {/* Signal 2 */}
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-rose-900 flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5 text-rose-600" />
                    Late-Night Usage
                  </span>
                  <span className="text-xs font-bold text-rose-700 tabular-nums">42 min</span>
                </div>
                <div className="text-xs text-rose-800/80">
                  Activity recorded past bedtime threshold (9:30 PM)
                </div>
              </div>

              {/* Signal 3 */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-amber-900 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    Rapid Scrolling
                  </span>
                  <span className="text-xs font-bold text-amber-700 tabular-nums">620 swiped</span>
                </div>
                <div className="text-xs text-amber-800/80">
                  Short feeds swiped in rapid cycles (&lt; 4s per clip)
                </div>
              </div>

              {/* Signal 4 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-purple-600" />
                    Dopamine Loops
                  </span>
                  <span className="text-xs font-bold text-purple-700">Rising Trend</span>
                </div>
                <div className="text-xs text-slate-500">
                  Algorithmic reward spikes accelerating in afternoon
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Short feeds account for 78% of Maya&apos;s late-night compulsion triggers.</span>
          </div>
        </div>
      </div>

      {/* 7-Day Chart & Daily Comparison */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              7-Day Screen Time History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any bar to inspect daily usage vs the {dailyLimit} min family guideline.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 bg-indigo-600 rounded-sm" />
              Within Goal
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm" />
              Exceeded Goal
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-56 flex items-end gap-2 sm:gap-4 pt-4 pb-2 border-b border-slate-200">
          {displayWeekMins.map((mins, idx) => {
            const isOver = mins > dailyLimit;
            const barHeightPct = Math.round((mins / maxVal) * 100);
            const isSelected = activeDayIdx === idx;

            return (
              <div
                key={DAYS_OF_WEEK[idx]}
                onClick={() => setActiveDayIdx(idx)}
                className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
              >
                <span
                  className={`text-[11px] font-semibold tabular-nums mb-1 transition-opacity ${
                    isSelected ? 'text-slate-900 opacity-100' : 'text-slate-400 group-hover:opacity-100'
                  }`}
                >
                  {mins}m
                </span>

                <div
                  className={`w-full rounded-t-lg transition-all duration-300 relative ${
                    isOver
                      ? 'bg-rose-500 group-hover:bg-rose-600'
                      : 'bg-indigo-600 group-hover:bg-indigo-700'
                  } ${isSelected ? 'ring-2 ring-indigo-900 ring-offset-2' : ''}`}
                  style={{ height: `${barHeightPct}%` }}
                />

                <span
                  className={`text-xs mt-2 font-medium ${
                    isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  {DAYS_OF_WEEK[idx]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Day Detail Box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-slate-700">
              {DAYS_OF_WEEK[activeDayIdx]}&apos;s Log:
            </span>{' '}
            <strong className="text-slate-900 tabular-nums">{currentMins} minutes</strong> (
            {Math.floor(currentMins / 60)}h {currentMins % 60}m)
            {activeDayIdx === 6 && (
              <span className="ml-2 text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-1.5 py-0.5 rounded">
                Live Child Mode Sync
              </span>
            )}
            {isCurrentOver ? (
              <span className="text-rose-600 font-semibold ml-2">
                — {currentMins - dailyLimit} min above target
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold ml-2">
                — {dailyLimit - currentMins} min saved under target
              </span>
            )}
          </div>
          <span className="text-slate-400">
            Daily goal reference: {dailyLimit} min
          </span>
        </div>
      </div>

      {/* AI Mentor Coaching & Bedtime Routine Box */}
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm sm:text-base">
          <BedDouble className="w-5 h-5 text-indigo-600" />
          <span>AI Mentor Strategy: Evening Wind-Down Plan</span>
        </div>

        <p className="text-xs sm:text-sm text-indigo-900/90 leading-relaxed">
          &ldquo;Maya&apos;s evening scrolling spikes between 9:00 PM and 9:45 PM. When dopamine-loop apps are accessible in bed, willpower alone rarely works. Propose a collaborative family docking station in the kitchen 30 minutes before sleep.&rdquo;
        </p>

        <div className="bg-white/90 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <strong className="text-xs sm:text-sm text-slate-900 block mb-0.5">
              30-Minute Family Wind-Down Routine
            </strong>
            <span className="text-xs text-slate-500">
              1. Both parent & Maya dock devices at 9:00 PM · 2. 15 min book or sketch · 3. Sleep by 9:30 PM
            </span>
          </div>

          <button
            onClick={() => setBedtimeAgreement(!bedtimeAgreement)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              bedtimeAgreement
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {bedtimeAgreement ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Agreement Active
              </>
            ) : (
              'Commit to Routine'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
