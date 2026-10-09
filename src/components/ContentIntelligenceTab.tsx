import React, { useState } from 'react';
import { ContentCategory, ContentInspectionResult } from '../types';
import { Brain, Search, Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Play } from 'lucide-react';

interface ContentIntelligenceTabProps {
  categories: ContentCategory[];
}

export const ContentIntelligenceTab: React.FC<ContentIntelligenceTabProps> = ({
  categories,
}) => {
  const [searchTitle, setSearchTitle] = useState('Minecraft Redstone Logic Gate Tutorial');
  const [platform, setPlatform] = useState('YouTube');
  const [loading, setLoading] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<ContentInspectionResult | null>({
    category: 'STEM & Logic Foundations',
    riskLevel: 'Low',
    addictionScore: 28,
    cognitiveImpact: 'Active problem-solving, spatial visualization, and sequential logic mimicking basic circuit engineering.',
    parentTakeaway: 'Nurture this curiosity by connecting game logic to real-world electronics kits like Arduino or micro:bit.',
    conversationPrompt: `"Show me how that redstone contraption works! Did it take a lot of tries to get the timing right?"`
  });
  const [inspectError, setInspectError] = useState('');

  const samplePresets = [
    { title: 'Skibidi Toilet Episode 70 Full Compilation', platform: 'YouTube Shorts' },
    { title: 'Scratch Coding: Make a Platformer Game', platform: 'LearnPath' },
    { title: 'MrBeast $1,000,000 Laser Maze Challenge', platform: 'YouTube' },
    { title: 'Free Robux Generator 2026 Promo Code Hack', platform: 'TikTok' },
  ];

  const getClientFallbackInspection = (title: string): ContentInspectionResult => {
    const lower = title.toLowerCase();
    if (lower.includes('code') || lower.includes('scratch') || lower.includes('python') || lower.includes('logic')) {
      return {
        category: 'STEM & Logic Foundations',
        riskLevel: 'Low',
        addictionScore: 24,
        cognitiveImpact: 'Active problem-solving, algorithmic sequencing, and creator mindset development.',
        parentTakeaway: 'Great cognitive investment! Encourage Maya to showcase what she built at family dinner.',
        conversationPrompt: `"Show me how the code works! Did you run into any bugs while making it?"`
      };
    }
    if (lower.includes('robux') || lower.includes('free') || lower.includes('hack') || lower.includes('gift card')) {
      return {
        category: 'Cyber Risk & Phishing Bait',
        riskLevel: 'High',
        addictionScore: 88,
        cognitiveImpact: 'Exploitative scarcity loops designed to coerce credentials or download unverified apps.',
        parentTakeaway: 'Crucial cyber safety lesson: Verify whether accounts or passwords were typed in external links.',
        conversationPrompt: `"Did you know scams often promise free game items just to steal passwords? Let's check how to spot fake websites together."`
      };
    }
    if (lower.includes('short') || lower.includes('toilet') || lower.includes('meme') || lower.includes('tiktok')) {
      return {
        category: 'High Dopamine Loop / Fast-Paced Short Feed',
        riskLevel: 'High',
        addictionScore: 82,
        cognitiveImpact: 'Rapid sensory reward loops with minimal retention. High potential for cognitive fatigue.',
        parentTakeaway: 'Agree on a concrete 20-minute timer and switch to a physical crafting activity.',
        conversationPrompt: `"When you watch those quick videos, does your brain feel super fast or a bit overwhelmed?"`
      };
    }
    return {
      category: 'General Digital Media & Gaming',
      riskLevel: 'Moderate',
      addictionScore: 55,
      cognitiveImpact: 'Balanced entertainment with moderate cognitive engagement.',
      parentTakeaway: 'Ask what made this interesting and explore if there is a creative way to expand on it.',
      conversationPrompt: `"What was your favorite part of that? Would you want to make something like that yourself?"`
    };
  };

  const handleInspect = async (queryTitle?: string, queryPlatform?: string) => {
    const titleToUse = queryTitle || searchTitle;
    const platToUse = queryPlatform || platform;
    if (!titleToUse.trim()) return;

    setLoading(true);
    setInspectError('');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch('/api/gemini/inspect-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentTitle: titleToUse, platform: platToUse }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.category) {
          setInspectionResult(data);
          return;
        }
      }
      setInspectionResult(getClientFallbackInspection(titleToUse));
    } catch {
      setInspectionResult(getClientFallbackInspection(titleToUse));
    } finally {
      setLoading(false);
    }
  };

  // Build conic gradient for the donut chart
  let cumulative = 0;
  const gradientStops = categories.map((cat) => {
    const start = cumulative;
    const end = cumulative + cat.pct;
    cumulative = end;
    return `${cat.color} ${start}% ${end}%`;
  });
  const donutBackground = `conic-gradient(${gradientStops.join(', ')})`;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Category Breakdown & AI Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Donut Chart Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                What Maya Consumes
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Last 7 Days Classification
              </span>
            </div>

            {/* Donut graphic */}
            <div className="flex flex-col sm:flex-row items-center gap-6 my-4">
              <div
                className="w-40 h-40 rounded-full shrink-0 relative flex items-center justify-center shadow-xs"
                style={{ background: donutBackground }}
              >
                <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center shadow-xs">
                  <span className="text-xl font-black text-slate-900 tabular-nums">100%</span>
                  <span className="text-[10px] text-slate-400 font-medium">Mapped</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full text-xs">
                {categories.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-slate-600 truncate">{cat.name}:</span>
                    <strong className="text-slate-900 tabular-nums font-semibold ml-auto">
                      {cat.pct}%
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
            Education and creative content comprise <strong>35%</strong> of Maya&apos;s active screen exposure.
          </div>
        </div>

        {/* AI Behavioral Insights Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Cognitive Potential Detected
            </h2>
          </div>

          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-900">Top Interest: Constructive Gaming</span>
                <span className="text-indigo-600">24% of Watch Time</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rather than passive consumption, Maya spends the majority of gaming time watching building mechanics, redstone logic, and sandbox architecture.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-900">STEM Aptitude Growth</span>
                <span className="text-emerald-600 font-semibold">+12% this month</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tutorials on block coding, astrophysics simulations, and space missions have steadily replaced passive meme compilation reels.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-900">Emerging Creativity Signal</span>
                <span className="text-purple-600">Drawing & Animation</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Watched 3 consecutive digital illustration step-by-steps on LearnPath. High potential for physical art integration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Gemini Content Inspector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              Live AI Content Inspector
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Curious about a video, game, or creator Maya is watching? Test it with Gemini&apos;s developmental psychology model.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            Powered by Gemini 3.8 Flash
          </span>
        </div>

        {/* Presets */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-400 block mb-2">
            Try a sample query:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePresets.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => {
                  setSearchTitle(preset.title);
                  setPlatform(preset.platform);
                  handleInspect(preset.title, preset.platform);
                }}
                className="px-2.5 py-1 rounded-md text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-left truncate max-w-xs"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Enter YouTube video title, streamer name, or topic..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="YouTube">YouTube</option>
            <option value="YouTube Shorts">YouTube Shorts</option>
            <option value="Instagram">Instagram</option>
            <option value="Roblox">Roblox</option>
          </select>
          <button
            onClick={() => handleInspect()}
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Inspect Content
              </>
            )}
          </button>
        </div>

        {inspectError && (
          <div className="p-3 mb-4 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200">
            {inspectError}
          </div>
        )}

        {/* Results Card */}
        {inspectionResult && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Classification:
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {inspectionResult.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">Addiction Factor:</span>
                <span
                  className={`text-sm font-extrabold tabular-nums px-2 py-0.5 rounded-md ${
                    inspectionResult.addictionScore > 60
                      ? 'bg-rose-100 text-rose-700'
                      : inspectionResult.addictionScore > 35
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {inspectionResult.addictionScore}/100 ({inspectionResult.riskLevel} Risk)
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 block mb-1">
                Cognitive Impact Assessment
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {inspectionResult.cognitiveImpact}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
              <div className="flex items-start gap-2 text-indigo-900">
                <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 mb-0.5">Parent Mentoring Opportunity:</strong>
                  <span className="text-slate-600 leading-relaxed">
                    {inspectionResult.parentTakeaway}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-start gap-2">
                <span className="font-semibold text-slate-700 shrink-0">Conversation opener:</span>
                <em className="text-slate-600">{inspectionResult.conversationPrompt}</em>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
