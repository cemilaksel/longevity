import React from 'react';
import { Activity, BarChart3, Instagram, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="mt-16 px-4 max-w-3xl mx-auto text-center">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <FooterLink 
        href="https://chatgpt.com/g/g-GKsuaDZUU-longevity-guide" 
        icon={<Activity size={16} />} 
        label="Longevity Guide" 
      />
      <FooterLink 
        href="https://chatgpt.com/g/g-SZqNg3QPk-msproject-pro" 
        icon={<BarChart3 size={16} />} 
        label="MS Project Pro" 
      />
      <FooterLink 
        href="https://www.instagram.com/longevity.story/" 
        icon={<Instagram size={16} />} 
        label="Instagram" 
      />
      <FooterLink 
        href="https://notebooklm.google.com/" 
        icon={<BookOpen size={16} />} 
        label="NotebookLM" 
      />
    </div>
    <div className="pt-8 border-t border-white/10">
      <p className="text-white/40 text-sm font-medium">
        Hazırlayan: <span className="text-gold">Cemil Aksel</span> | Üretken Yapay Zeka Eğitimi
      </p>
    </div>
  </footer>
);

function FooterLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 group min-h-[80px]"
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
