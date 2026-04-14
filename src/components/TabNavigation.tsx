import React from 'react';
import { Step } from '../types';

interface TabNavigationProps {
  steps: Step[];
  activeTab: number;
  onTabChange: (id: number) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ steps, activeTab, onTabChange }) => (
  <nav className="sticky top-0 z-10 bg-teal-dark/90 backdrop-blur-md border-b border-white/10 mb-6 overflow-x-auto no-scrollbar">
    <div className="flex px-4 py-2 min-w-max space-x-2">
      {steps.map((step) => (
        <button
          key={step.id}
          onClick={() => onTabChange(step.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${
            activeTab === step.id
              ? 'bg-gold text-teal-dark shadow-lg scale-105'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          {step.icon}
          <span>{step.label}</span>
        </button>
      ))}
    </div>
  </nav>
);
