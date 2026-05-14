import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { useJournal } from '../hooks/useJournal';
import { JournalEntryCard } from './JournalEntryCard';
import { Info, Save, Trash2, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JournalViewProps {
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ onCopy, copiedId, onNotify }) => {
  const { entries, saveEntry, deleteEntry, getStats } = useJournal();
  
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [formData, setFormData] = useState<JournalEntry>({
    happy: ['', '', ''],
    wishes: ['', '', ''],
    routineNote: ''
  });
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const stats = getStats();

  const handleSave = () => {
    const hasData = [...formData.happy, ...formData.wishes].some(i => i.trim()) || formData.routineNote.trim();
    if (!hasData) {
      onNotify('⚠️ Lütfen en az bir alan doldurun!', 'error');
      return;
    }

    if (entries[date]) {
      // Overwrite check (handled implicitly here, but could be a modal)
      onNotify('🔄 Mevcut kayıt güncellendi', 'info');
    } else {
      onNotify('✅ Günlük kaydedildi', 'success');
    }

    saveEntry(date, formData);
  };

  const clearForm = () => {
    setFormData({
      happy: ['', '', ''],
      wishes: ['', '', ''],
      routineNote: ''
    });
  };

  const handleEdit = (entryDate: string, entry: JournalEntry) => {
    setDate(entryDate);
    setFormData(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNotify('✏️ Kayıt düzenleme moduna alındı', 'info');
  };

  const sortedDates = Object.keys(entries).sort().reverse();

  return (
    <div className="space-y-8">
      {/* 1. Header & Info */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">📔 Günlüğüm</h2>
            <p className="text-sm text-slate-500 font-medium">3 mutlu şey · 3 dilek · rutin geliştirme</p>
          </div>
          <div className="bg-purple-100/50 px-4 py-2 rounded-2xl border border-purple-200">
            <p className="text-[10px] font-black text-purple-700 uppercase tracking-widest">Aylık Durum</p>
            <p className="text-xs font-bold text-purple-900">Bu ay {stats.thisMonth} gün yazıldı</p>
          </div>
        </div>

        <div className="bg-linear-to-br from-indigo-50 to-purple-50 border border-purple-100 p-5 rounded-3xl flex items-start space-x-4 shadow-xs">
          <div className="p-2 bg-purple-500 rounded-xl text-white">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-purple-900 font-bold">Rutinlerinizi Geliştirin</p>
            <p className="text-xs text-purple-800/80 leading-relaxed">
              Bu sayfa düşüncelerinizi SAKLAR. Alışkanlık takibini (yaptım/yapmadım) 
              <span className="font-bold"> TickTick</span>'te yapın — burada içeriği yazın.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Today's Entry Form */}
      <div className="bg-white border-2 border-purple-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 bg-purple-50/50 border-b border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <CalendarIcon className="text-purple-600" size={20} />
             <input 
              type="date" 
              className="bg-transparent border-none focus:ring-0 font-black text-slate-700 p-0 text-lg"
              value={date}
              onChange={e => setDate(e.target.value)}
             />
          </div>
          <button 
            onClick={clearForm}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 uppercase tracking-wider"
          >
            Formu Temizle
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Happy Section */}
          <div className="space-y-4">
             <label className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
               <span>😊 3 Mutlu Olduğum Şey</span>
             </label>
             <div className="space-y-3">
               {formData.happy.map((val, i) => (
                 <input 
                  key={i}
                  type="text"
                  placeholder={`Örn: Öğrencimin 'anladım hocam' demesi`}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none font-medium transition-all"
                  value={val}
                  onChange={e => {
                    const newHappy = [...formData.happy];
                    newHappy[i] = e.target.value;
                    setFormData({...formData, happy: newHappy});
                  }}
                 />
               ))}
             </div>
          </div>

          {/* Wishes Section */}
          <div className="space-y-4">
             <label className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
               <span>⭐ 3 Dileğim</span>
             </label>
             <div className="space-y-3">
               {formData.wishes.map((val, i) => (
                 <input 
                  key={i}
                  type="text"
                  placeholder={`Örn: Yarın dersin akıcı geçmesi`}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium transition-all"
                  value={val}
                  onChange={e => {
                    const newWishes = [...formData.wishes];
                    newWishes[i] = e.target.value;
                    setFormData({...formData, wishes: newWishes});
                  }}
                 />
               ))}
             </div>
          </div>

          {/* Routine Note */}
          <div className="space-y-4">
             <label className="text-xs font-black text-purple-600 uppercase tracking-widest flex items-center gap-2">
               <span>🌙 Rutin Geliştirme Notu</span>
             </label>
             <textarea 
              rows={4}
              placeholder="Bugün hangi rutinimi geliştirdim / geliştirmek istiyorum? Örn: Sabah 10 dk okuma rutinine başladım"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-400 outline-none font-medium transition-all resize-none"
              value={formData.routineNote}
              onChange={e => setFormData({...formData, routineNote: e.target.value})}
             />
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-5 bg-linear-to-r from-purple-600 to-indigo-700 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Save size={20} />
            <span>GÜNLÜĞÜ KAYDET</span>
          </button>
        </div>
      </div>

      {/* 3. Past Entries Timeline */}
      <div className="space-y-6 pt-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-4">
          Zaman Çizelgesi
        </h3>
        
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {sortedDates.map(entryDate => (
              <motion.div 
                key={entryDate}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <JournalEntryCard 
                  date={entryDate}
                  entry={entries[entryDate]}
                  onEdit={handleEdit}
                  onDelete={setIsDeleting}
                  onCopy={onCopy}
                  copiedId={copiedId}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {sortedDates.length === 0 && (
            <div className="text-center py-20 px-10 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold italic">Henüz günlük kaydı bulunmuyor. İlk kaydınızı yukarıdan yapın!</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
              <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-3">
                <AlertCircle className="text-red-500" size={24} />
                Kayıt Silinsin mi?
              </h3>
              <p className="text-sm text-slate-600 font-medium mb-8">
                Bu günlük kaydı kalıcı olarak silinecektir. Emin misiniz?
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleting(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
                >
                  Vazgeç
                </button>
                <button 
                  onClick={() => {
                    deleteEntry(isDeleting);
                    setIsDeleting(null);
                    onNotify('🗑️ Kayıt silindi', 'success');
                  }}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition shadow-lg active:scale-95"
                >
                  Sil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
