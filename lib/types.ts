// Core shared types for the LIFE.EXE agent system.

export type Category =
  | "relationships"
  | "dating"
  | "friendship"
  | "family"
  | "social"
  | "communication"
  | "conflict"
  | "career"
  | "education"
  | "money"
  | "purchases"
  | "work"
  | "decision"
  | "productivity"
  | "transition"
  | "travel"
  | "technology"
  | "current_events"
  | "scam"
  | "other";

export type OutcomeGoal =
  | "understand"
  | "decide"
  | "fix"
  | "converse"
  | "boundary"
  | "reduce_uncertainty"
  | "prepare"
  | "explore"
  | "vent";

export type EngineStageId =
  | "understand"
  | "context"
  | "clarify"
  | "research"
  | "explore"
  | "simulate"
  | "decide"
  | "act";

export interface EngineStage {
  id: EngineStageId;
  index: number;
  label: string;
  message: string;
}

export interface EmotionalContext {
  tone: "calm" | "anxious" | "frustrated" | "sad" | "conflicted" | "urgent" | "hopeful";
  intensity: number; // 0-1
  stakes: "low" | "medium" | "high";
}

export interface ClassificationResult {
  categories: Category[];
  primaryCategory: Category;
  secondaryCategory?: Category;
  emotional: EmotionalContext;
  needsResearch: boolean;
  researchReason?: string;
  needsClarification: boolean;
  clarifyingQuestions: string[];
  isScamLike: boolean;
  isRecoveryMode: boolean;
  isHighStakes: boolean;
  summary: string;
  whatWeKnow: string[];
  whatWeDontKnow: string[];
}

export interface Strategy {
  id: string;
  title: string;
  tag: string;
  approach: string;
  advantages: string[];
  risks: string[];
  whenItMakesSense: string;
  exampleAction: string;
  recommended?: boolean;
}

export interface ResearchSource {
  title: string;
  domain: string;
  snippet: string;
  url: string;
}

export interface ResearchResult {
  used: boolean;
  mode: "demo" | "live";
  query: string;
  answer?: string;
  sources: ResearchSource[];
  disclaimer: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  benefits: string[];
  risks: string[];
  tradeoffs: string[];
  shortTerm: string;
  longTerm: string;
}

export interface DecisionFrame {
  goals: string[];
  priorities: string[];
  constraints: string[];
  options: DecisionOption[];
}

export interface WhatIfScenario {
  optionId: string;
  scenario: string;
  isHypothetical: true;
}

export interface RiskSignal {
  id: string;
  label: string;
  detected: boolean;
  weight: number;
  explanation: string;
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ScamAnalysis {
  riskLevel: RiskLevel;
  score: number;
  signals: RiskSignal[];
  explanation: string;
  nextSteps: string[];
}

export interface RecoveryPlan {
  whatHappened: string;
  whatMattersNow: string[];
  whatCanStillBeFixed: string[];
  immediateActions: string[];
  whatToSay: string[];
  whatNotToDo: string[];
  nextSteps: string[];
}

export interface RoleplayRole {
  id: string;
  label: string;
  description: string;
}

export interface RoleplayMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
}

export interface RoleplayScores {
  clarity: number;
  assertiveness: number;
  empathy: number;
  escalation: number;
  goalAlignment: number;
}

export interface AgentTurn {
  id: string;
  createdAt: number;
  userInput: string;
  classification: ClassificationResult;
  research?: ResearchResult;
  strategies?: Strategy[];
  decisionFrame?: DecisionFrame;
  scam?: ScamAnalysis;
  recovery?: RecoveryPlan;
  nextStep: string;
}

export interface SituationSession {
  id: string;
  createdAt: number;
  title: string;
  outcomeGoal?: OutcomeGoal;
  turns: AgentTurn[];
  practiced: boolean;
  decisionExplored: boolean;
}

export interface HistoryEntry {
  id: string;
  title: string;
  category: Category;
  createdAt: number;
  type: "situation" | "roleplay" | "decision";
}

export type ThemeId =
  | "cosmos"
  | "futuristic"
  | "ambient"
  | "mono"
  | "organic"
  | "glass"
  | "ocean"
  | "sunset";
