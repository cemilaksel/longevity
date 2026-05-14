import React from 'react';
import { JournalEntry } from '../types';
import { Calendar, Smile, Star, Moon, Copy, Edit2, Trash2, Check } from 'lucide-react';
import { formatTurkishDate } from '../lib/dateUtils';

interface JournalEntryCardProps {
  date: string;
  entry: JournalEntry;
  onEdit: (date: string, entry: JournalEntry) => void;
  onDelete: (date: string) => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}

export const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ 
  date, 
  entry, 
  onEdit, 
  onDelete, 
  onCopy,
  copiedId
}) => {
  const formattedDate = formatTurkishDate(new Date(date));
  const cardId = `journal-${date}`;

  const handleCopy = () => {
    const text = `${date} Günlüğüm:
Mutlu olduğum 3 şey:
${entry.happy.filter(i => i.trim()).map(i => `- ${i}`).join('\n')}

3 dileğim:
${entry.wishes.filter(i => i.trim()).map(i => `- ${i}`).join('\n')}

Rutin geliştirme:
${entry.routineNote || 'Yazılmadı'}`;

    onCopy(text, cardId);
  };

  return (
    <div className="bg-white border border-purple-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-shadow relative group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-purple-600">
          <Calendar size={18} />
          <span className="font-bold text-sm">{formattedDate}</span>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={handleCopy}
            className={`p-2 rounded-xl transition-all ${copiedId === cardId ? 'bg-green-500 text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
            title="Kopyala"
          >
            {copiedId === cardId ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <button 
            onClick={() => onEdit(date, entry)}
            className="p-2 text-slate-400 hover:bg-slate-50 hover:text-blue-500 rounded-xl transition-all"
            title="Düzenle"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(date)}
            className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
            title="Sil"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {entry.happy.some(h => h.trim()) && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-amber-500">
              <Smile size={16} />
              <span className="text-[10px] font-black uppercase tracking-wider">Mutlu Olduğum Şeyler</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 ml-6 list-disc decoration-amber-200">
              {entry.happy.filter(h => h.trim()).map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        {entry.wishes.some(w => w.trim()) && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-blue-500">
              <Star size={16} />
              <span className="text-[10px] font-black uppercase tracking-wider">Dileklerim</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 ml-6 list-disc decoration-blue-200">
              {entry.wishes.filter(w => w.trim()).map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {entry.routineNote && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-purple-500">
              <Moon size={16} />
              <span className="text-[10px] font-black uppercase tracking-wider">Rutin Geliştirme Notu</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed bg-purple-50/50 p-3 rounded-2xl border border-purple-100/50 italic">
              {entry.routineNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
