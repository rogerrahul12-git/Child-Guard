import React, { useState } from 'react';
import { MentorGuidance, SafetyAlert } from '../types';
import { Users, Sparkles, AlertCircle, CheckCircle, Copy, Check, MessageSquareHeart, Lightbulb, ShieldCheck, HeartHandshake } from 'lucide-react';
import { playAndroidSound, triggerHaptic } from '../utils/androidAudio';

interface MentorGuideTabProps {
  totalMinsUsed?: number;
  selectedAlertForGuidance: SafetyAlert | null;
  onClearSelectedAlert: () => void;
}

export const MentorGuideTab: React.FC<MentorGuideTabProps> = ({
  totalMinsUsed = 140,
  selectedAlertForGuidance,
  onClearSelectedAlert,
}) => {
  const [situationText, setSituationText] = useState(
    selectedAlertForGuidance
      ? `${selectedAlertForGuidance.title}: ${selectedAlertForGuidance.detail}`
      : `Maya accumulated ${totalMinsUsed} minutes of screen time today (YouTube Shorts and BlockWorld) and gets defensive when limits or sleep times are brought up.`
  );

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [guidance, setGuidance] = useState<MentorGuidance | null>({
    approach: "Replace accusations with open curiosity. When an 11-year-old feels judged, defensive walls go up; when asked to explain their perspective, self-reflection awakens.",
    dialogueOpener: "\"Hey Maya, I noticed how fast time seemed to slip away on YouTube last night. Do you ever feel like the app is designed to trick your brain into not stopping?\"",
    reflectiveQuestions: [
      "\"When you finally put the screen down, how does your body feel — energized or sleepy and drained?\"",
      "\"If you were designing YouTube so it actually helped kids sleep better, what rule would you build into it?\"",
      "\"What's one project or drawing you’d love to work on tonight instead of quick scrolling?\""
    ],
    antiPatternsToAvoid: [
      "Don't snatch the device or turn off the Wi-Fi abruptly mid-video without a 5-minute warning.",
      "Avoid shaming words like 'You are addicted' or 'You are ruining your brain'."
    ],
    collaborativeAgreement: "Agree to charge the tablet in the living room docking station every night starting at 9:00 PM."
  });
  const [detectedCategory, setDetectedCategory] = useState<string>('Late-Night Bedtime Habits');

  const sampleScenarios = [
    {
      label: 'YouTube Shorts Binge (48 min)',
      text: 'Maya spent 48 minutes swiping through YouTube Shorts, exceeding her afternoon screen budget and acting irritable when interrupted.',
    },
    {
      label: 'Stranger Contact Request',
      text: 'An unknown gamer asked Maya for her real name and phone number on ChatLite direct messages.',
    },
    {
      label: 'Gaming & Refusing Dinner',
      text: 'Maya was playing BlockWorld for 2 hours and refused to stop to eat dinner with the family.',
    },
    {
      label: 'Meltdown Upon Shutdown',
      text: 'Maya showed strong anger and slammed doors when the daily 140-minute timer powered down.',
    },
    {
      label: 'Homework Procrastination',
      text: 'Maya keeps switching to social media feeds instead of finishing her math homework.',
    },
    {
      label: 'Sneaking Tablet Under Bed Blanket',
      text: 'Maya snuck her tablet under bed sheets after 9:30 PM bedtime to continue watching videos.',
    },
  ];

  // Comprehensive Clinical Mentoring Generator
  const generateValidMentoringPlan = (situation: string, childName = 'Maya'): { plan: MentorGuidance; category: string } => {
    const s = situation.toLowerCase();

    // 1. YouTube Shorts / TikTok / Reels / Short feeds / Binge scrolling
    if (s.includes('short') || s.includes('tiktok') || s.includes('reel') || s.includes('youtube') || s.includes('scroll') || s.includes('feed')) {
      return {
        category: 'Short-Form Dopamine Loops & Swiping Fatigue',
        plan: {
          approach: `Short-form algorithms deliver variable rewards every 5-15 seconds, creating strong neural inertia. Maya isn't being willfully stubborn; her developing prefrontal cortex is experiencing genuine cognitive fatigue and dopamine overstimulation. Validate the magnetic pull of the algorithm before discussing balance.`,
          dialogueOpener: `"Hey ${childName}, I noticed how fast time seemed to evaporate on those short clips today. Do you ever feel like the app is designed like a game that tricks your thumb into not wanting to stop?"`,
          reflectiveQuestions: [
            `"When you've been swiping for 30 or 40 minutes, does your mind feel calm and inspired, or kind of buzzy and tired?"`,
            `"What's one creative video or hobby idea you actually want to make yourself instead of watching other people's feeds?"`,
            `"If we set a gentle 20-minute audio chime so you can finish your favorite creator's video peacefully, would that help?"`
          ],
          antiPatternsToAvoid: [
            `Don't yank the device out of her hands mid-clip without giving a 3-minute wrap-up notice.`,
            `Avoid shaming labels like 'You have no self-control' or 'You are brainwashed by that trash'.`
          ],
          collaborativeAgreement: `Implement the 20-Minute Transition Rule: After 20 minutes of short clips, take a 5-minute physical reset (water, sketch, or backyard stretch).`
        }
      };
    }

    // 2. Sneaking device / Under blanket / Hidden night usage
    if (s.includes('sneak') || s.includes('blanket') || s.includes('hide') || s.includes('secret') || s.includes('bed') || s.includes('night') || s.includes('sleep')) {
      return {
        category: 'Bedtime Autonomy & Circadian Sleep Protection',
        plan: {
          approach: `Sneaking a device at night usually stems from fear of missing out (FOMO) or using blue light as an emotional avoidance crutch when trying to fall asleep. Treat this as an invitation to build a cozy, screen-free bedtime routine rather than a crime.`,
          dialogueOpener: `"Hey ${childName}, I found the tablet in your bed last night. I'm not here to yell at you or ground you—I want to understand what makes nighttime feel hard without the screen."`,
          reflectiveQuestions: [
            `"Is scrolling helping you wind down, or is it actually keeping your brain awake even when your eyes feel tired?"`,
            `"Do you worry about missing what friends are chatting about late at night?"`,
            `"What's an audio story, podcast, or cozy book we could set up on the speaker so you have soothing entertainment without glowing screens in your eyes?"`
          ],
          antiPatternsToAvoid: [
            `Don't search her bedroom aggressively like a prison guard, which damages mutual trust.`,
            `Don't turn sleep into a punitive battleground by issuing harsh room restrictions.`
          ],
          collaborativeAgreement: `Family Central Docking: Every device in the house (parents included!) charges in the kitchen docking station starting at 9:00 PM.`
        }
      };
    }

    // 3. Gaming / Roblox / Minecraft / BlockWorld / Meals
    if (s.includes('roblox') || s.includes('minecraft') || s.includes('block') || s.includes('fortnite') || s.includes('game') || s.includes('gaming') || s.includes('dinner') || s.includes('meal')) {
      const isMeal = s.includes('dinner') || s.includes('meal') || s.includes('eat');
      return {
        category: isMeal ? 'Gaming Flow & Family Mealtime Boundaries' : 'Constructive Gaming Flow & Time Awareness',
        plan: {
          approach: `Gaming immerses 11-year-olds in intense dopamine loops and social flow states. When pulled away abruptly${isMeal ? ' for dinner' : ''}, their brain experiences an abrupt chemical dip. Help ${childName} anticipate transitions ahead of time rather than competing with the screen.`,
          dialogueOpener: isMeal
            ? `"Hey ${childName}, I know how hard it is to pause right in the middle of a gaming round when dinner is ready. What were you working on or building in your game earlier?"`
            : `"Hey ${childName}, I see how passionate and focused you get when playing your games. Can you show me what you built or accomplished today?"`,
          reflectiveQuestions: [
            `"How long does a typical round or building challenge usually take so we can schedule around it?"`,
            `"Does the game make it feel like 2 hours passed in 10 minutes? Why do you think game creators design it that way?"`,
            `"What would be a fair 10-minute warning system so you have time to save your progress without rushing?"`
          ],
          antiPatternsToAvoid: [
            `Don't shut off the Wi-Fi or pull the plug mid-match while she is playing with friends.`,
            `Don't dismiss her gaming achievements as 'pointless toys' or 'wasting your life'.`
          ],
          collaborativeAgreement: isMeal
            ? `Agree on a 10-minute 'final save' alert before dinner so she can wrap up her session cleanly before sitting down.`
            : `Set a 2-hour daily gaming window with a required 10-minute physical stretch break every 45 minutes.`
        }
      };
    }

    // 4. Stranger inquiries / Grooming / Personal details
    if (s.includes('stranger') || s.includes('contact') || s.includes('phone') || s.includes('discord') || s.includes('gamer') || s.includes('number') || s.includes('address') || s.includes('private')) {
      return {
        category: 'Cyber Safety & Stranger Shielding',
        plan: {
          approach: `Reassure ${childName} that she did nothing wrong. Frame personal data privacy not as a restrictive chore, but as her personal digital armor that shields her from manipulative actors.`,
          dialogueOpener: `"Hey ${childName}, our safety shield quarantined an inquiry from an unfamiliar account earlier. You're not in any trouble at all! Can we talk about how strangers sometimes try to blend in as kids in online games?"`,
          reflectiveQuestions: [
            `"If an adult you didn't know walked up to you in a park and asked for your phone number, what would you do? How is chatting online similar?"`,
            `"Why do you think some players try to move chats off the game onto private apps like Snapchat or WhatsApp?"`,
            `"What are three private details—like school, home address, or phone number—that must always stay strictly between us?"`
          ],
          antiPatternsToAvoid: [
            `Don't react with panic or anger, which teaches kids to hide future uncomfortable encounters.`,
            `Don't ban all digital devices out of fear, which promotes secret unmonitored accounts.`
          ],
          collaborativeAgreement: `Immediate no-penalty rule: Whenever anyone online asks for real-life contact info, ${childName} alerts a parent with zero risk of getting her device taken away.`
        }
      };
    }

    // 5. Homework / School / Procrastination
    if (s.includes('homework') || s.includes('school') || s.includes('math') || s.includes('study') || s.includes('procrastinat') || s.includes('grade')) {
      return {
        category: 'Focus, Academics & Digital Procrastination',
        plan: {
          approach: `Reaching for a phone during homework is usually an avoidance response to academic frustration or cognitive overload, not laziness. Separate the emotional block from the device distraction.`,
          dialogueOpener: `"Hey ${childName}, I noticed you were reaching for your phone while trying to do your schoolwork. Is something in this assignment feeling confusing or harder than usual?"`,
          reflectiveQuestions: [
            `"Which problem or subject feels like the steepest mountain to climb today?"`,
            `"Would it help if we did the first two tricky problems together before you tackle the rest?"`,
            `"How does your brain focus when your phone is in another room versus sitting right next to your notebook?"`
          ],
          antiPatternsToAvoid: [
            `Don't call her 'lazy' or compare her study habits to siblings or top students.`,
            `Don't ban devices if she legitimately needs school portals or digital calculators to finish.`
          ],
          collaborativeAgreement: `Implement the 25/5 rule: 25 minutes of completely phone-free homework, followed by a 5-minute movement or snack break.`
        }
      };
    }

    // 6. Meltdowns / Anger / Resistance to Shutdown
    if (s.includes('anger') || s.includes('meltdown') || s.includes('rage') || s.includes('door') || s.includes('screaming') || s.includes('timer') || s.includes('shut')) {
      return {
        category: 'Emotional Regulation & Screen Transitions',
        plan: {
          approach: `Sudden screen shutdowns provoke a rapid neurochemical dopamine crash. ${childName}'s anger is a physiological shock reaction, not personal disrespect. Let the emotional wave pass before discussing boundaries.`,
          dialogueOpener: `"Hey ${childName}, I saw how upset and frustrated you felt when the tablet powered down earlier. It really hurts having fun cut off unexpectedly, doesn't it?"`,
          reflectiveQuestions: [
            `"When the timer goes off, does your body feel revved up and hard to slow down?"`,
            `"Would a countdown clock with a 5-minute and 2-minute chime help you prepare to step away calmly?"`,
            `"What is a cozy physical activity—like sketching or an evening snack—we can do right after screen time ends?"`
          ],
          antiPatternsToAvoid: [
            `Don't match her anger with shouting or escalate punishments during the emotional crest.`,
            `Don't reward tantrums by granting 'just 10 more minutes', which reinforces explosive behavior.`
          ],
          collaborativeAgreement: `Introduce a dual-warning system (10m and 2m alert) followed immediately by a pleasant real-world ritual.`
        }
      };
    }

    // 7. Cyberbullying / Mean comments / Peer drama
    if (s.includes('bully') || s.includes('mean') || s.includes('withdrawn') || s.includes('sad') || s.includes('tease') || s.includes('comment') || s.includes('server')) {
      return {
        category: 'Peer Resilience & Cyberbullying Shield',
        plan: {
          approach: `Online insults deeply impact 11-year-olds who are forming their social identity. Validate her feelings completely and help her recognize that mean comments reflect the bully's issues, never her worth.`,
          dialogueOpener: `"Hey ${childName}, you seemed a little quiet and heavy-hearted earlier. I'm always on your team—did someone say something unkind or unfair online?"`,
          reflectiveQuestions: [
            `"How did reading those words make your chest and stomach feel? It's completely okay to feel hurt or mad."`,
            `"Do you think people post cruel comments because they're happy with themselves, or because they're looking for attention?"`,
            `"Would you like us to block and report that user together right now so you never have to see their messages again?"`
          ],
          antiPatternsToAvoid: [
            `Don't dismiss her pain with 'It's just the internet, just ignore it'.`,
            `Don't seize her phone as a 'solution' to peer drama, which punishes the victim.`
          ],
          collaborativeAgreement: `Zero-engagement policy: Never reply to an insult. Take a screenshot, hit block, and debrief with Mom or Dad immediately.`
        }
      };
    }

    // 8. Default / Screen Balance
    return {
      category: 'Digital Wellness & Healthy Balance',
      plan: {
        approach: `Approach ${childName} with curious interest rather than discipline. Short feeds and long device sessions outpace an 11-year-old's prefrontal regulation. Focus on building partnership rather than policing.`,
        dialogueOpener: `"Hey ${childName}, I noticed you spent ${totalMinsUsed} minutes exploring apps today. What was the coolest or most surprising thing you came across?"`,
        reflectiveQuestions: [
          `"When you finally put the screen down, how does your body feel — energized or sleepy and drained?"`,
          `"If you were designing tablet guidelines to help your best friend balance fun and rest, what would you suggest?"`,
          `"What's one creative project or offline activity you'd love to try tonight?"`
        ],
        antiPatternsToAvoid: [
          `Don't storm in and snatch the device off the table without a warm, connective check-in.`,
          `Avoid shaming language like 'You are addicted' or 'You are ruining your brain'.`
        ],
        collaborativeAgreement: `Set a clear daily balance goal (${totalMinsUsed}m recorded today) paired with scheduled screen-free family moments.`
      }
    };
  };

  const handleGenerateGuidance = async (customSituation?: string) => {
    const textToUse = customSituation || situationText;
    if (!textToUse.trim()) return;

    playAndroidSound('tap');
    triggerHaptic(30);
    setLoading(true);
    setCopied(false);

    // Compute the high-fidelity clinical plan right away
    const { plan: computedPlan, category } = generateValidMentoringPlan(textToUse, 'Maya');
    setDetectedCategory(category);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch('/api/gemini/mentor-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation: textToUse, childName: 'Maya', childAge: 11 }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.approach && data.dialogueOpener) {
          setGuidance(data);
          playAndroidSound('success');
          triggerHaptic(40);
          setLoading(false);
          return;
        }
      }
      setGuidance(computedPlan);
      playAndroidSound('success');
      triggerHaptic(40);
    } catch {
      setGuidance(computedPlan);
      playAndroidSound('success');
      triggerHaptic(40);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOpener = () => {
    if (!guidance?.dialogueOpener) return;
    navigator.clipboard?.writeText(guidance.dialogueOpener);
    playAndroidSound('tap');
    triggerHaptic(20);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Ready Conversation Starters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Conversation Starters for Tonight
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Curious, gentle questions that build self-regulation without feeling like an interrogation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-2">
              &ldquo;What&apos;s a game or video you enjoyed today? What made it so interesting?&rdquo;
            </p>
            <span className="text-xs text-indigo-600 font-medium pt-2 border-t border-slate-200/60">
              Why it works: Validates her interests and builds connection before discussing screen limits.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-2">
              &ldquo;If someone you met in a game asked to video chat, what would your gut tell you to do?&rdquo;
            </p>
            <span className="text-xs text-indigo-600 font-medium pt-2 border-t border-slate-200/60">
              Why it works: Practices cyber safety reasoning in a hypothetical, judgment-free space.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-2">
              &ldquo;How do you feel after long screen sessions? Do you feel refreshed or kind of tired?&rdquo;
            </p>
            <span className="text-xs text-indigo-600 font-medium pt-2 border-t border-slate-200/60">
              Why it works: Builds somatic self-awareness regarding screen fatigue and dopamine hangover.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-2">
              &ldquo;Is there anything you saw online this week that felt weird, confusing, or made you uncomfortable?&rdquo;
            </p>
            <span className="text-xs text-indigo-600 font-medium pt-2 border-t border-slate-200/60">
              Why it works: Reminds Maya that she can always talk to you without fear of losing her device.
            </span>
          </div>
        </div>
      </div>

      {/* AI Mentoring Coach Generator Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              AI Parent Mentoring Coach
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter any situation or dilemma with Maya. The AI crafts a compassionate psychological coaching script.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
            Psychological Coaching Model
          </span>
        </div>

        {/* Preset quick scenarios */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-500 block mb-2">
            Select a common parenting scenario or type your own below:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleScenarios.map((sc) => (
              <button
                key={sc.label}
                type="button"
                onClick={() => {
                  setSituationText(sc.text);
                  handleGenerateGuidance(sc.text);
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium transition-colors border border-slate-200/60"
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea */}
        <div className="mb-4">
          <textarea
            rows={3}
            value={situationText}
            onChange={(e) => setSituationText(e.target.value)}
            placeholder="Describe what happened or what you want to talk to Maya about (e.g. refused dinner to play Roblox, sneaking phone in bed, homework avoidance)..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
          />
        </div>

        <div className="flex items-center justify-between gap-3 mb-6">
          {selectedAlertForGuidance && (
            <button
              onClick={onClearSelectedAlert}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Clear imported alert
            </button>
          )}

          <button
            onClick={() => handleGenerateGuidance()}
            disabled={loading || !situationText.trim()}
            className="ml-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Crafting Coaching Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Mentoring Plan
              </>
            )}
          </button>
        </div>

        {/* Structured Results Display */}
        {guidance && (
          <div className="p-5 sm:p-6 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-5 animate-fade-in">
            {/* Header / Category Badge */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-indigo-200/60 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Targeted Strategy:
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {detectedCategory}
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Ready For Tonight
              </span>
            </div>

            {/* Mindset Approach */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                01. Psychological Framing & Approach
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {guidance.approach}
              </p>
            </div>

            {/* Dialogue Opener with Copy Button */}
            <div className="p-4 rounded-xl bg-white border border-indigo-100 shadow-xs relative">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  02. Exact Opening Words For Tonight
                </span>
                <button
                  type="button"
                  onClick={handleCopyOpener}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Opener</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm sm:text-base font-bold text-indigo-950 italic leading-relaxed pr-16 sm:pr-0">
                {guidance.dialogueOpener}
              </p>
            </div>

            {/* 3 Reflective Questions */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block mb-2">
                03. Three Reflective Questions
              </span>
              <div className="space-y-2">
                {guidance.reflectiveQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/90 border border-slate-200 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5 shadow-2xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Anti Patterns & Collaborative Agreement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-indigo-200/60">
              <div className="p-4 rounded-xl bg-white/80 border border-rose-200 text-xs">
                <span className="font-bold text-rose-700 block mb-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Anti-Patterns to Avoid
                </span>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700 leading-relaxed">
                  {guidance.antiPatternsToAvoid.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/80 border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-700 block mb-1.5 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Collaborative Family Agreement
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {guidance.collaborativeAgreement}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
