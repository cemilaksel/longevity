import React from 'react';
import { Activity, BarChart3, Instagram, BookOpen, CheckCircle2 } from 'lucide-react';
import { useGPTStorage, GPTType } from '../hooks/useGPTStorage';

export const Footer: React.FC = () => {
  const { getSession } = useGPTStorage();

  const handleSmartOpen = (gptType: GPTType) => {
    const session = getSession(gptType);
    const genericUrls = {
      longevity: 'https://chatgpt.com/g/g-GKsuaDZUU-longevity-guide',
      msproject: 'https://chatgpt.com/g/g-SZqNg3QPk-msproject-pro'
    };
    
    const url = session ? session.url : genericUrls[gptType];
    window.open(url, '_blank');
  };

  const longevitySession = getSession('longevity');
  const msprojectSession = getSession('msproject');

  return (
    <footer className="mt-16 px-4 max-w-4xl mx-auto text-center pb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <FooterButton 
          onClick={() => handleSmartOpen('longevity')}
          icon={<Activity size={18} />} 
          label="Longevity Guide" 
          active={!!longevitySession}
        />
        <FooterButton 
          onClick={() => handleSmartOpen('msproject')}
          icon={<BarChart3 size={18} />} 
          label="MS Project Pro" 
          active={!!msprojectSession}
        />
        <FooterLink 
          href="https://www.instagram.com/longevity.story/" 
          icon={<Instagram size={18} />} 
          label="Instagram" 
        />
        <FooterLink 
          href="https://notebooklm.google.com/" 
          icon={<BookOpen size={18} />} 
          label="NotebookLM" 
        />
      </div>

      <div className="text-center mb-8">
        <p className="text-xs text-teal-100/40 flex items-center justify-center space-x-2 italic">
          <span className="inline-block w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
          <span>Yeşil ikonlu butonlar: Kayıtlı sohbetiniz varsa oraya gider, yoksa yeni sohbet açar.</span>
        </p>
      </div>

      <div className="pt-8 border-t border-white/10">
        <p className="text-white/40 text-sm font-medium">
          Hazırlayan: <span className="text-gold">Cemil Aksel</span> | Üretken Yapay Zeka Eğitimi
        </p>
      </div>
    </footer>
  );
};

function FooterButton({ onClick, icon, label, active }: { onClick: () => void; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 group min-h-[90px] w-full"
    >
      <div className={`${active ? 'text-green-400' : 'text-gold'} mb-2 group-hover:scale-110 transition-transform relative`}>
        {icon}
        {active && <CheckCircle2 size={12} className="absolute -top-1 -right-1" />}
      </div>
      <span className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-tight">
        {label}
      </span>
    </button>
  );
}

function FooterLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 group min-h-[90px]"
    >
      <div className="text-gold mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-tight">
        {label}
      </span>
    </a>
  );
}
