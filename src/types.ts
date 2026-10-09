export interface AppItem {
  id: number;
  name: string;
  mins: number;
  category: string;
  color: string;
  iconLetter: string;
  riskRating: 'Low' | 'Moderate' | 'High';
}

export interface ContentCategory {
  name: string;
  pct: number;
  color: string;
  description: string;
}

export interface SafetyAlert {
  id: number;
  severity: 'high' | 'medium' | 'low';
  type: 'Cyber Safety' | 'Addiction' | 'Wellbeing' | 'Content';
  title: string;
  detail: string;
  time: string;
  reviewed: boolean;
  recommendedAction?: string;
}

export interface QuizQuestion {
  id: number;
  q: string;
  opts: string[];
  answer: number;
  why: string;
}

export interface ShutdownConfig {
  limitEnabled: boolean;
  limitMinutes: number;
  clockEnabled: boolean;
  clockTime: string;
  clockOverride: boolean;
  locked: boolean;
  reason: string;
}

export interface MentorGuidance {
  approach: string;
  dialogueOpener: string;
  reflectiveQuestions: string[];
  antiPatternsToAvoid: string[];
  collaborativeAgreement: string;
}

export interface ContentInspectionResult {
  category: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  addictionScore: number;
  cognitiveImpact: string;
  parentTakeaway: string;
  conversationPrompt: string;
}
