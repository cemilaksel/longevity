import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Step } from '../types';
import { PromptCard } from './PromptCard';
import { Step3Form } from './Step3Form';
import { GPTButtons } from './GPTButtons';
import { PersonSelector } from './PersonSelector';
import { PersonGPTButtons } from './PersonGPTButtons';
import { Step9A3Report } from './Step9A3Report';
import { JournalView } from './JournalView';
import { usePersonStorage } from '../hooks/usePersonStorage';

interface StepContentProps {
  step: Step;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  personStorage: ReturnType<typeof usePersonStorage>;
  baseDate: Date;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const StepContent: React.FC<StepContentProps> = ({ step, copiedId, onCopy, personStorage, baseDate, onNotify }) => {
  const { 
    persons, 
    activePerson, 
    switchPerson, 
    addPerson, 
    deletePerson 
  } = personStorage;

  const gptUrl = step.gptType === 'msproject' 
    ? 'https://chatgpt.com/g/g-SZqNg3QPk-msproject-pro'
    : step.gptType === 'a3'
    ? 'https://chatgpt.com/g/g-GKsuaDZUU-longevity-guide' // Using Longevity Guide for A3 as per common patterns
    : 'https://chatgpt.com/g/g-GKsuaDZUU-longevity-guide';

  const gptTitle = step.gptType === 'msproject' ? 'MS Project Pro' : (step.gptType === 'a3' ? 'A3 Report' : 'Longevity Guide');

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold text-teal-dark mb-6 flex items-center">
        {step.title}
      </h2>

      {/* GPT Quick Buttons */}
      {step.gptType && step.id !== 8 && step.id !== 10 && (
        <GPTButtons 
          gptType={step.gptType} 
          title={gptTitle}
          newChatUrl={gptUrl}
        />
      )}

      {/* Special Multi-Person UI for Step 8 (shifted from 7) */}
      {step.id === 8 && (
        <>
          <PersonSelector 
            persons={persons}
            activePerson={activePerson}
            onSwitch={switchPerson}
            onAdd={addPerson}
            onDelete={deletePerson}
          />
          <PersonGPTButtons 
            newChatUrl={gptUrl}
            activePerson={activePerson}
            savePersonChatURL={personStorage.savePersonChatURL}
          />
        </>
      )}

      {/* Interactive Content */}
    {step.isInteractive && step.id === 3 ? (
      <Step3Form 
        onCopyAll={(text) => onCopy(text, 'all')} 
        onCopyCard={onCopy} 
        copiedId={copiedId} 
        baseDate={baseDate}
      />
    ) : step.isInteractive && step.id === 7 ? (
      <JournalView 
        onCopy={onCopy}
        onNotify={onNotify}
        copiedId={copiedId}
      />
    ) : step.isInteractive && step.id === 10 ? (
      <Step9A3Report 
        baseDate={baseDate}
        onCopyPrompt={onCopy}
        copiedId={copiedId}
      />
    ) : (
      <>
        {/* Info Box */}
        {step.infoBox && (
          <div className={`mb-6 p-4 rounded-2xl text-sm leading-relaxed ${
            step.infoBox.type === 'green' 
              ? 'bg-green-50 text-green-800 border border-green-100' 
              : 'bg-amber-50 text-amber-800 border border-amber-100'
          }`}>
            <pre className="whitespace-pre-wrap font-sans">{step.infoBox.content}</pre>
          </div>
        )}

        {/* Extra Content (Lists, Tables, etc.) */}
        {step.extraContent && (
          <div className="mb-8">
            {step.extraContent}
          </div>
        )}

        {/* Prompts */}
        <div className="space-y-8">
          {step.prompts?.map((prompt) => (
            <PromptCard 
              key={prompt.id} 
              prompt={prompt} 
              copiedId={copiedId} 
              onCopy={onCopy} 
              activePersonName={activePerson.name}
            />
          ))}
        </div>

        {/* Footer Info Box */}
        {step.footerInfoBox && (
          <div className={`mt-8 p-4 rounded-2xl text-sm leading-relaxed ${
            step.footerInfoBox.type === 'green' 
              ? 'bg-green-50 text-green-800 border border-green-100' 
              : step.footerInfoBox.type === 'orange'
              ? 'bg-orange-50 text-orange-800 border border-orange-100'
              : 'bg-amber-50 text-amber-800 border border-amber-100'
          }`}>
            <pre className="whitespace-pre-wrap font-sans">{step.footerInfoBox.content}</pre>
          </div>
        )}
      </>
    )}

    {/* Link Button */}
    {step.link && (
      <div className="mt-8">
        <a
          href={step.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 w-full py-4 bg-linear-to-r from-green-start to-green-end text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 min-h-[56px]"
        >
          <span>{step.linkText || "GPT'ye Git"}</span>
          <ExternalLink size={18} />
        </a>
      </div>
    )}
    </div>
  );
};
