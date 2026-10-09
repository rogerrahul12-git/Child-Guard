import React, { useState } from 'react';
import { AppItem, QuizQuestion } from '../types';
import { ShieldCheck, Lock, CheckCircle2, XCircle, ArrowRight, Sparkles, MessageCircleQuestion } from 'lucide-react';
import mayaAvatarUrl from '../assets/images/child_maya_avatar_1791525308280.jpg';
import { playAndroidSound, triggerHaptic } from '../utils/androidAudio';

interface ChildViewProps {
  apps: AppItem[];
  dailyLimit: number;
  totalMinsUsed: number;
  quizQuestions: QuizQuestion[];
  onAddUsage?: (mins: number) => void;
  onResetUsage?: () => void;
}

export const ChildView: React.FC<ChildViewProps> = ({
  apps,
  dailyLimit,
  totalMinsUsed,
  quizQuestions,
  onAddUsage,
  onResetUsage,
}) => {
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const currentQuiz = quizQuestions[currentQuizIdx] || quizQuestions[0];
  const maxAppMins = Math.max(...apps.map((a) => a.mins), 1);
  const percentUsed = Math.min(100, Math.round((totalMinsUsed / dailyLimit) * 100));
  const isOverLimit = totalMinsUsed > dailyLimit;
  const remainingMins = Math.max(0, dailyLimit - totalMinsUsed);

  const handleSelectQuizOption = (optIndex: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(optIndex);
    setAnsweredCount((prev) => prev + 1);
    if (optIndex === currentQuiz.answer) {
      setQuizScore((prev) => prev + 1);
      playAndroidSound('success');
      triggerHaptic(40);
    } else {
      playAndroidSound('alert');
      triggerHaptic([60, 40, 60]);
    }
  };

  const handleNextQuiz = () => {
    playAndroidSound('tap');
    triggerHaptic(20);
    setSelectedOpt(null);
    setCurrentQuizIdx((prev) => (prev + 1) % quizQuestions.length);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
        <div className="relative shrink-0">
          <img
            src={mayaAvatarUrl}
            alt="Maya"
            className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-200 shadow-xs"
          />
          <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white rounded-full p-1 shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Hi Maya! 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Here&apos;s how your digital day is going. You&apos;re doing a wonderful job exploring and learning!
          </p>
          <div className="mt-3 flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Daily Balance Goal</span>
            <span aria-hidden="true">·</span>
            <span>{dailyLimit} min recommended</span>
          </div>
        </div>
      </div>

      {/* Screen Time Circular Gauge Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          {/* Circular Ring Gauge */}
          <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background track circle */}
              <circle
                cx="80"
                cy="80"
                r="68"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="11"
              />
              {/* Foreground progress circle */}
              <circle
                cx="80"
                cy="80"
                r="68"
                fill="none"
                stroke={isOverLimit ? '#f43f5e' : '#f59e0b'}
                strokeWidth="11"
                strokeLinecap="round"
                strokeDasharray={427.26}
                strokeDashoffset={427.26 - (427.26 * Math.min(100, percentUsed)) / 100}
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Inner Content inside circle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums leading-none">
                {totalMinsUsed}
              </span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                min used
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                of {dailyLimit}m goal
              </span>
            </div>
          </div>

          {/* Details & Status beside the circle */}
          <div className="flex-1 text-center sm:text-left flex flex-col justify-center space-y-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Today&apos;s Screen Time
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily family goal: <strong className="text-slate-700 tabular-nums">{dailyLimit} min</strong> ({Math.floor(dailyLimit / 60)}h {dailyLimit % 60}m)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md tabular-nums ${
                  isOverLimit
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isOverLimit
                  ? `Goal exceeded by ${totalMinsUsed - dailyLimit} min`
                  : `${remainingMins} min remaining today`}
              </span>

              <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md tabular-nums">
                {percentUsed}% of goal
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {isOverLimit
                ? "You've reached your daily balance goal for today. Time to rest your eyes, stretch, and power down for sleep!"
                : "You're doing great keeping your screen time in balance. Remember to take short vision breaks every 30 minutes!"}
            </p>

            {/* Test / Simulation Action Bar */}
            {onAddUsage && (
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">
                  Test limit shutdown:
                </span>
                <button
                  type="button"
                  onClick={() => onAddUsage(10)}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  +10m use
                </button>
                <button
                  type="button"
                  onClick={() => onAddUsage(30)}
                  className="px-2.5 py-1 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                >
                  +30m use (crosses limit)
                </button>
                {onResetUsage && (
                  <button
                    type="button"
                    onClick={onResetUsage}
                    className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-slate-600 ml-auto"
                  >
                    Reset to 140m
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apps breakdown & Removal requests */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h2 className="text-lg font-bold text-slate-900">Minutes Used Per App Today</h2>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Total active apps: {apps.length}
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mb-6 flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Installed apps and screen time balance are safely supervised by your parents in Parent Mode.
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {apps.map((app) => {
            const appWidth = Math.max(8, Math.round((app.mins / maxAppMins) * 100));

            return (
              <div
                key={app.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-xs shrink-0"
                    style={{ backgroundColor: app.color }}
                  >
                    {app.iconLetter}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900">{app.name}</h3>
                    <span className="text-xs text-slate-500">{app.category}</span>
                  </div>
                </div>

                {/* Progress in row */}
                <div className="flex-1 max-w-md mx-0 sm:mx-4">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${appWidth}%`, backgroundColor: app.color }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                  <span className="text-sm font-bold text-slate-800 tabular-nums min-w-[70px] text-right bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    {app.mins} min
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Tips Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Maya&apos;s Safety Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5">
            <div className="text-amber-800 font-bold text-sm mb-1 flex items-center gap-2">
              <span>🔒 Keep private info private</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Never share your home address, school name, phone number, or passwords with people you meet online, even if they claim to be a friend.
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5">
            <div className="text-amber-800 font-bold text-sm mb-1 flex items-center gap-2">
              <span>🙋 Tell a trusted adult</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              If something you see makes you feel uncomfortable, confused, or scared, you won&apos;t get in trouble. Tell Mom or Dad right away.
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5">
            <div className="text-amber-800 font-bold text-sm mb-1 flex items-center gap-2">
              <span>🤝 Be kind & thoughtful</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Think about how your comments feel to someone reading them. Cheering others on and stepping away from arguments makes the internet better.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Safety Quiz */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <MessageCircleQuestion className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Quick Quiz: Spot the Scam!</h2>
              <span className="text-xs text-slate-500">
                Question {currentQuizIdx + 1} of {quizQuestions.length}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 block">Score</span>
            <span className="text-sm font-bold text-indigo-600 tabular-nums">
              {quizScore} / {answeredCount}
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base font-semibold text-slate-900 mb-4 leading-relaxed">
          {currentQuiz.q}
        </p>

        {/* Options */}
        <div className="space-y-2.5 mb-4">
          {currentQuiz.opts.map((option, idx) => {
            const isSelected = selectedOpt === idx;
            const isCorrect = idx === currentQuiz.answer;

            let btnStyle = 'border-slate-200 bg-white hover:border-slate-300 text-slate-800';
            if (selectedOpt !== null) {
              if (isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
              } else if (isSelected) {
                btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-semibold';
              } else {
                btnStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectQuizOption(idx)}
                disabled={selectedOpt !== null}
                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
              >
                <span>{option}</span>
                {selectedOpt !== null && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {selectedOpt !== null && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback block */}
        {selectedOpt !== null && (
          <div
            className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed mb-4 ${
              selectedOpt === currentQuiz.answer
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}
          >
            <strong>
              {selectedOpt === currentQuiz.answer ? '✅ Great job! ' : '💡 Good effort! '}
            </strong>
            {currentQuiz.why}
          </div>
        )}

        {/* Next Question Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            Learn together with your family
          </span>
          <button
            onClick={handleNextQuiz}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            Next question
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
