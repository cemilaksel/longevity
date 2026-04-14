import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  activeTab: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ activeTab, totalSteps }) => (
  <div className="max-w-3xl mx-auto px-4 mb-6">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">İlerleme Durumu</span>
      <span className="text-xs font-bold text-gold">Adım {activeTab}/{totalSteps}</span>
    </div>
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(activeTab / totalSteps) * 100}%` }}
        className="h-full bg-linear-to-r from-green-start to-green-end"
      />
    </div>
  </div>
);
