import React from 'react';

export interface PromptItem {
  id: string;
  title: string;
  content: string;
  note?: string;
  example?: string;
  bgColor?: string;
}

export interface InfoBox {
  type: 'green' | 'yellow' | 'orange';
  content: string;
}

export interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  link?: string;
  linkText?: string;
  gptType?: 'longevity' | 'msproject' | 'a3';
  prompts?: PromptItem[];
  infoBox?: InfoBox;
  footerInfoBox?: InfoBox;
  extraContent?: React.ReactNode;
  isInteractive?: boolean;
}

export interface A3DailyRecord {
  date: string;
  sleep: { bedTime: string; wakeTime: string };
  weight: string;
  meals: { time: string; food: string }[];
  exercises: { time: string; detail: string }[];
  works: { time: string; detail: string }[];
  reading: { time: string; detail: string };
  mood: { score: number; emotion: string; note: string };
  planning: { plans: string[]; reals: string[] };
  categories: { name: string; hours: number }[];
}

export interface A3FormState {
  theme: string;
  period: 'week' | 'month' | 'quarter';
  background: string;
  target: string;
}
