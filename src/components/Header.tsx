import React from 'react';
import { Hospital } from 'lucide-react';

export const Header: React.FC = () => (
  <header className="pt-8 pb-6 px-4 text-center">
    <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
      <Hospital className="text-gold" size={32} />
    </div>
    <h1 className="text-2xl md:text-3xl font-bold text-gold mb-2">
      Longevity Guide - IF ve Kilo Takibi
    </h1>
    <p className="text-white/80 text-sm md:text-base max-w-lg mx-auto">
      Prof. Dr. Müftüoğlu | Peakspan | 5 Altın Kural
    </p>
  </header>
);
