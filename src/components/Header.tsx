import React from 'react';
import { Hospital } from 'lucide-react';

interface HeaderProps {
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => (
  <header className="py-3 px-6 w-full">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
          <Hospital className="text-gold" size={30} />
        </div>
        <div className="text-left">
          <h1 className="text-xl md:text-2xl font-bold text-gold leading-tight">
            Longevity Guide
          </h1>
          <p className="text-white/60 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
            IF ve Kilo Takibi | Peakspan
          </p>
        </div>
      </div>
      
      <div className="flex items-center">
        {children}
      </div>
    </div>
  </header>
);
