import React from 'react';
import { Clipboard, Check } from 'lucide-react';
import { PromptItem } from '../types';

interface PromptCardProps {
  prompt: PromptItem;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, copiedId, onCopy }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <h3 className="text-sm font-bold text-teal-dark/60 uppercase tracking-wide">
        {prompt.title}
      </h3>
      {prompt.note && (
        <span className="text-xs text-amber-600 font-medium italic">
          * {prompt.note}
        </span>
      )}
    </div>
    
    {prompt.example && (
      <p className="text-xs text-gray-500 mb-1">{prompt.example}</p>
    )}

    <div className="relative group">
      <pre className="bg-slate-900 text-slate-100 p-5 rounded-2xl text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
        {prompt.content}
      </pre>
      <button
        onClick={() => onCopy(prompt.content, prompt.id)}
        className={`absolute top-3 right-3 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-2 min-h-[40px] ${
          copiedId === prompt.id
            ? 'bg-green-500 text-white'
            : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
        }`}
      >
        {copiedId === prompt.id ? (
          <>
            <Check size={14} />
            <span>Kopyalandı!</span>
          </>
        ) : (
          <>
            <Clipboard size={14} />
            <span>Kopyala</span>
          </>
        )}
      </button>
    </div>
  </div>
);
