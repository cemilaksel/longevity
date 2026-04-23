/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Model & Types
import { getSteps } from './constants';

// Controller (Logic)
import { useAppLogic } from './hooks/useAppLogic';
import { useGPTStorage } from './hooks/useGPTStorage';

// View (Components)
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { ProgressBar } from './components/ProgressBar';
import { StepContent } from './components/StepContent';
import { Footer } from './components/Footer';
import { DatePicker } from './components/DatePicker';

export default function App() {
  const { 
    activeTab, 
    setActiveTab, 
    copiedId, 
    copyToClipboard, 
    nextStep, 
    prevStep,
    baseDate,
    setBaseDate,
    dynamicDates
  } = useAppLogic();

  const { notification } = useGPTStorage();

  const steps = useMemo(() => getSteps(dynamicDates), [dynamicDates]);
  const currentStep = steps.find(s => s.id === activeTab)!;

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-dark to-teal-medium pb-12">
      <Header>
        <DatePicker 
          currentDate={baseDate} 
          onDateChange={setBaseDate} 
        />
      </Header>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl text-white font-bold text-sm min-w-[280px] text-center backdrop-blur-md ${
              notification.type === 'success' ? 'bg-green-500/90' : 
              notification.type === 'error' ? 'bg-red-500/90' : 'bg-blue-500/90'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <TabNavigation 
        steps={steps} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <ProgressBar 
        activeTab={activeTab} 
        totalSteps={steps.length} 
      />

      <main className="max-w-3xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <StepContent 
              step={currentStep} 
              copiedId={copiedId} 
              onCopy={copyToClipboard} 
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between items-center px-2">
          <button
            onClick={prevStep}
            disabled={activeTab === 1}
            className={`px-6 py-3 rounded-2xl font-bold transition-all min-h-[44px] ${
              activeTab === 1 
                ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Geri
          </button>
          <button
            onClick={nextStep}
            disabled={activeTab === steps.length}
            className={`px-6 py-3 rounded-2xl font-bold transition-all min-h-[44px] ${
              activeTab === steps.length 
                ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-gold text-teal-dark hover:scale-105 shadow-lg'
            }`}
          >
            İleri
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
