import React, { useEffect, useRef } from 'react';
import { Settings } from 'lucide-react';
import { Step } from '../types';

interface TabNavigationProps {
  steps: Step[];
  activeTab: number | 'settings';
  onTabChange: (id: number | 'settings') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ steps, activeTab, onTabChange }) => {
  const tabsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const activeTabElement = tabsRef.current[activeTab.toString()];
    if (activeTabElement) {
      activeTabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  return (
    <nav className="sticky top-0 z-40 bg-teal-dark/95 backdrop-blur-md border-b border-white/5 mb-8 w-full">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-start md:justify-center">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-full no-scrollbar pb-1">
            <div className="flex gap-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  ref={(el) => (tabsRef.current[step.id.toString()] = el)}
                  onClick={() => onTabChange(step.id)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center space-x-2 min-h-[44px] ${
                    activeTab === step.id
                      ? 'bg-gold text-teal-dark border-2 border-slate-900 ring-2 ring-white shadow-[0_0_15px_rgba(255,215,0,0.3)] scale-105'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/5 hover:text-white'
                  }`}
                >
                  <span className={activeTab === step.id ? 'opacity-100' : 'opacity-60'}>
                    {step.icon}
                  </span>
                  <span>{step.label}</span>
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="w-px h-6 bg-white/20 mx-2 shrink-0" />

            {/* Settings Tab */}
            <button
              ref={(el) => (tabsRef.current['settings'] = el)}
              onClick={() => onTabChange('settings')}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center space-x-2 min-h-[44px] ${
                activeTab === 'settings'
                  ? 'bg-gold text-teal-dark border-2 border-slate-900 ring-2 ring-white shadow-[0_0_15px_rgba(255,215,0,0.3)] scale-105'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/5 hover:text-white'
              }`}
            >
              <Settings size={18} className={activeTab === 'settings' ? 'text-teal-dark' : 'opacity-60'} />
              <span>Ayarlar</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
