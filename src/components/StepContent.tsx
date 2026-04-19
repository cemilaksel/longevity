import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Step } from '../types';
import { PromptCard } from './PromptCard';
import { Step3Form } from './Step3Form';

interface StepContentProps {
  step: Step;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

export const StepContent: React.FC<StepContentProps> = ({ step, copiedId, onCopy }) => (
  <div className="p-6 md:p-8">
    <h2 className="text-xl md:text-2xl font-bold text-teal-dark mb-6 flex items-center">
      {step.title}
    </h2>

    {/* Interactive Form for Step 3 */}
    {step.isInteractive && step.id === 3 ? (
      <Step3Form 
        onCopyAll={(text) => onCopy(text, 'all')} 
        onCopyCard={onCopy} 
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
            />
          ))}
        </div>
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
