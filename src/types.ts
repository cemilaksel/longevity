import React from 'react';

export interface PromptItem {
  id: string;
  title: string;
  content: string;
  note?: string;
  example?: string;
}

export interface InfoBox {
  type: 'green' | 'yellow';
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
  prompts?: PromptItem[];
  infoBox?: InfoBox;
  extraContent?: React.ReactNode;
}
