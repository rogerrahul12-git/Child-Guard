import { AppItem, ContentCategory, SafetyAlert, QuizQuestion, ShutdownConfig } from '../types';

export const INITIAL_APPS: AppItem[] = [
  { id: 1, name: "YouTube Shorts", mins: 48, category: "Entertainment", color: "#ef4444", iconLetter: "YT", riskRating: "High" },
  { id: 2, name: "BlockWorld",     mins: 38, category: "Gaming",         color: "#22c55e", iconLetter: "BW", riskRating: "Moderate" },
  { id: 3, name: "LearnPath",      mins: 26, category: "Education",      color: "#f59e0b", iconLetter: "LP", riskRating: "Low" },
  { id: 4, name: "Instagram",      mins: 16, category: "Social Media",   color: "#ec4899", iconLetter: "IG", riskRating: "High" },
  { id: 5, name: "ChatLite",       mins: 12, category: "Social Media",   color: "#3b82f6", iconLetter: "CL", riskRating: "Moderate" }
];

export const INITIAL_CATEGORIES: ContentCategory[] = [
  { name: "Education",     pct: 28, color: "#22c55e", description: "STEM tutorials, science experiments, language basics" },
  { name: "Gaming",        pct: 24, color: "#3b82f6", description: "Sandbox building, strategy walk-throughs, speedruns" },
  { name: "Technology",    pct: 18, color: "#8b5cf6", description: "Scratch coding, robotics kits, space tech" },
  { name: "Entertainment", pct: 14, color: "#f59e0b", description: "Comedy skits, meme compilations, animation" },
  { name: "Social Media",  pct: 9,  color: "#ec4899", description: "Short-form video feeds, dance trends, creator reels" },
  { name: "Creative Arts", pct: 7,  color: "#14b8a6", description: "Digital sketching, origami, clay crafting" }
];

export const INITIAL_WEEK_MINUTES = [125, 140, 130, 155, 135, 160, 140];
export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const INITIAL_ALERTS: SafetyAlert[] = [
  {
    id: 1,
    severity: "high",
    type: "Cyber Safety",
    title: "Friend request from unknown account",
    detail: "An adult-looking account with no mutual contacts requested direct message access on ChatLite. Request was quarantined.",
    time: "Today, 4:12 PM",
    reviewed: false,
    recommendedAction: "Review contact list together and discuss how strangers pose as peers in gaming chat."
  },
  {
    id: 2,
    severity: "medium",
    type: "Addiction",
    title: "Late-night screen usage detected",
    detail: "Device remained continuously active after 9:30 PM for 42 minutes across short-form video apps.",
    time: "Yesterday, 9:52 PM",
    reviewed: false,
    recommendedAction: "Establish a physical docking station outside the bedroom 30 minutes before sleep."
  },
  {
    id: 3,
    severity: "high",
    type: "Cyber Safety",
    title: "Personal info string intercepted",
    detail: "An outgoing chat message contained a phone number and apartment address pattern. Sharing was blocked by RINAYA.",
    time: "Tue, 6:03 PM",
    reviewed: false,
    recommendedAction: "Reassure Maya that protecting personal data isn't a mistake, and practice what details are safe to share."
  },
  {
    id: 4,
    severity: "medium",
    type: "Wellbeing",
    title: "Mood signal in recent chat language",
    detail: "Several late-night messages used tired, stressed, or self-critical phrases. Consider an open check-in.",
    time: "Wed, 10:14 PM",
    reviewed: false,
    recommendedAction: "Ask: 'How has your week felt overall? Anything at school feeling heavy or stressful?'"
  }
];

export const INITIAL_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    q: "You get a message: 'You won a free gift card! Click here and enter your password.' What do you do?",
    opts: [
      "Click the link and type your password",
      "Ignore it and tell a trusted adult",
      "Forward the link to all your friends"
    ],
    answer: 1,
    why: "Legitimate contests never ask for your private passwords. Always ignore it and check with a trusted adult."
  },
  {
    id: 2,
    q: "A player in an online multiplayer game asks: 'What school do you go to?' What is the safest response?",
    opts: [
      "Tell them your school and town",
      "Politely decline and tell a trusted adult if they keep asking",
      "Tell them your teacher's name instead"
    ],
    answer: 1,
    why: "Never share school names, bus stops, or real-life locations with anyone online, even if they seem friendly."
  },
  {
    id: 3,
    q: "A link from a friend's account says 'Free rare skins here!' but the website URL looks strange. What should you do?",
    opts: [
      "Open it immediately before it expires",
      "Ask a grown-up before clicking or ask your friend in person",
      "Type your email to see if it works"
    ],
    answer: 1,
    why: "Accounts can get hacked to send fake scam links. Verifying with an adult or in person protects your accounts."
  },
  {
    id: 4,
    q: "Someone in a video comment says something mean about a drawing you posted. How should you react?",
    opts: [
      "Reply with an angry insult back",
      "Don't engage in anger; talk to a parent or use the block/report button",
      "Delete all your accounts forever"
    ],
    answer: 1,
    why: "Responding with anger fuels the bully. Stepping back, blocking, and talking to an adult keeps you calm and in control."
  }
];

export const INITIAL_SHUTDOWN: ShutdownConfig = {
  limitEnabled: true,
  limitMinutes: 300,    // 5 hours
  clockEnabled: false,
  clockTime: "21:30",
  clockOverride: false,
  locked: false,
  reason: ""
};
