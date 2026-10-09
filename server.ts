import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Utility: Timeout promise wrapper so slow external APIs never hang the server
const withTimeout = <T>(promise: Promise<T>, ms = 2500): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Operation timed out')), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

const getContextualGuidance = (situation: string, childName = 'Maya') => {
  const s = situation.toLowerCase();

  // 1. Gaming / Roblox / Minecraft / Meals
  if (s.includes('roblox') || s.includes('minecraft') || s.includes('fortnite') || s.includes('game') || s.includes('gaming') || s.includes('dinner') || s.includes('meal')) {
    const isMeal = s.includes('dinner') || s.includes('meal') || s.includes('eat');
    return {
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
    };
  }

  // 2. Strangers / Contact / Grooming
  if (s.includes('stranger') || s.includes('contact') || s.includes('phone') || s.includes('discord') || s.includes('gamer') || s.includes('number') || s.includes('address')) {
    return {
      approach: `Praise ${childName}'s honesty and instinct. Frame privacy as digital armor rather than a restriction so she feels empowered rather than policed.`,
      dialogueOpener: `"Hey ${childName}, I'm so proud that our safety shield flagged that message. Can we talk through how people sometimes pretend to be someone else in games?"`,
      reflectiveQuestions: [
        `"If a stranger in a store asked where you live, what would you do? How is online chat similar or different?"`,
        `"What are three pieces of info you should always keep strictly between us?"`,
        `"If someone ever tells you 'don't tell your parents', what does that tell you about their intentions?"`
      ],
      antiPatternsToAvoid: [
        `Don't ban all multiplayer games immediately, which encourages secret unapproved accounts.`,
        `Avoid reacting with anger or alarm, which teaches children to hide uncomfortable encounters.`
      ],
      collaborativeAgreement: `Agree to review friend requests together once a week and immediately report secret-asking users.`
    };
  }

  // 3. Homework / School Procrastination
  if (s.includes('homework') || s.includes('school') || s.includes('math') || s.includes('study') || s.includes('procrastinat') || s.includes('grade')) {
    return {
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
    };
  }

  // 4. Meltdown / Anger / Shutdown
  if (s.includes('anger') || s.includes('meltdown') || s.includes('shut') || s.includes('timer') || s.includes('rage')) {
    return {
      approach: `Recognize that abrupt gaming shutdowns trigger physiological dopamine drop-offs. Help ${childName} regulate the emotional dip before addressing the behavior.`,
      dialogueOpener: `"Hey ${childName}, I saw how frustrating it was when the timer interrupted your game. It really stinks having to stop right in the middle of something fun, doesn't it?"`,
      reflectiveQuestions: [
        `"When the timer goes off, does your brain feel super revved up or hard to slow down?"`,
        `"Would a 5-minute and 2-minute heads-up help you finish your match before the device powers down?"`,
        `"What is a calm physical activity we can do together right after turning the screen off?"`
      ],
      antiPatternsToAvoid: [
        `Don't match her anger with shouting or escalate punishments during the emotional spike.`,
        `Don't give in to tantrums by granting extra screen time, which reinforces the outburst.`
      ],
      collaborativeAgreement: `Establish a 'save point' warning 5 minutes before limit, followed by an immediate physical snack or stretch.`
    };
  }

  // 5. Bully / Mean Comments
  if (s.includes('bully') || s.includes('mean') || s.includes('withdrawn') || s.includes('sad') || s.includes('tease')) {
    return {
      approach: `Validate ${childName}'s feelings first. Cruel online comments hurt deeply, especially at age 11. Remind her that the insult reflects the sender's issues, not her worth.`,
      dialogueOpener: `"Hey ${childName}, you seemed a little quiet earlier. I'm always here for you if someone said something unkind or unfair online."`,
      reflectiveQuestions: [
        `"Did those words make you feel hurt, confused, or angry? It is completely normal to feel that way."`,
        `"Do you think people who post mean comments are happy with themselves, or looking for a reaction?"`,
        `"Would you like us to block and report that account together right now so you don't have to see them again?"`
      ],
      antiPatternsToAvoid: [
        `Don't dismiss her pain with 'Just ignore it' or 'It's just the internet'.`,
        `Don't take her phone away as a 'solution' to peer drama, which punishes the victim.`
      ],
      collaborativeAgreement: `Always use the mute/block button without engaging, and talk to an adult whenever a comment stings.`
    };
  }

  // Default / Late Night
  return {
    approach: `Approach ${childName} with curious interest rather than discipline. Focus on understanding what drives the behavior before proposing boundaries.`,
    dialogueOpener: `"Hey ${childName}, I noticed you were really into that content last night. What made it so fascinating?"`,
    reflectiveQuestions: [
      `"How did you feel right before deciding to turn it off — refreshed or sleepy and drained?"`,
      `"What's one thing in that game/video that you'd love to try building yourself in real life?"`,
      `"If a friend told you they couldn't stop swiping, what gentle advice would you give them?"`
    ],
    antiPatternsToAvoid: [
      `Don't immediately confiscate the phone without explanation, which drives secret usage.`,
      `Avoid shaming language like "You're addicted" or "You're wasting your life".`
    ],
    collaborativeAgreement: `Agree on a shared "wind-down docking station" in the hallway 30 minutes before bedtime.`
  };
};

// API: Mentor Guidance Generator
app.post('/api/gemini/mentor-guidance', async (req, res) => {
  const { situation, childName = 'Maya', childAge = 11 } = req.body;

  if (!situation) {
    return res.status(400).json({ error: 'Situation is required' });
  }

  if (!ai) {
    return res.json(getContextualGuidance(situation, childName));
  }

  try {
    const prompt = `You are RINAYA Guardian AI's expert child-psychology and digital wellness mentor.
The parent needs actionable, empathetic mentoring guidance for their ${childAge}-year-old child (${childName}).
Situation: "${situation}".

Respond with valid JSON with keys:
- "approach": (1-2 sentences on mindset and psychological framing)
- "dialogueOpener": (Exact natural sentence the parent can say out loud tonight)
- "reflectiveQuestions": (Array of 3 gentle open-ended questions that build self-regulation)
- "antiPatternsToAvoid": (Array of 2 common mistakes parents make here)
- "collaborativeAgreement": (1 actionable agreement to establish together)

Output raw JSON only.`;

    const generatePromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const response = await withTimeout(generatePromise, 2500);
    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    return res.json(getContextualGuidance(situation, childName));
  }
});

// API: Digital Content Inspector
app.post('/api/gemini/inspect-content', async (req, res) => {
  const { contentTitle, platform = 'YouTube' } = req.body;

  if (!contentTitle) {
    return res.status(400).json({ error: 'Content title is required' });
  }

  const getFallbackInspection = (title: string) => {
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

  if (!ai) {
    return res.json(getFallbackInspection(contentTitle));
  }

  try {
    const prompt = `Analyze this digital media title/topic for an 11-year-old child on ${platform}:
Title: "${contentTitle}"

Evaluate the content under child cognitive psychology standards.
Respond with raw JSON with keys:
- "category": (e.g., "STEM & Problem Solving", "High Dopamine Loop / Fast-Paced Short Feed", "Creative Arts", "Social Media / Peer Culture")
- "riskLevel": ("Low", "Moderate", "High")
- "addictionScore": (Integer between 10 and 95)
- "cognitiveImpact": (1-2 sentences on brain impact, attention span, or learning value)
- "parentTakeaway": (1 sentence parenting advice)
- "conversationPrompt": (1 open question for the parent to ask)

Output JSON only.`;

    const generatePromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const response = await withTimeout(generatePromise, 2500);
    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini content inspection error, using fallback:', err?.message || err);
    return res.json(getFallbackInspection(contentTitle));
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RINAYA Guardian AI server running on http://localhost:${PORT}`);
  });
}

startServer();
