import React, { useState } from 'react';
import { Pencil, Trash2, Check, X, User, ShieldAlert } from 'lucide-react';
import { Person } from '../hooks/usePersonStorage';
import { motion, AnimatePresence } from 'motion/react';

interface PersonManagerProps {
  persons: Person[];
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const PersonManager: React.FC<PersonManagerProps> = ({ persons, onRename, onDelete, onNotify }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleStartEdit = (person: Person) => {
    setEditingId(person.id);
    setEditName(person.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      onRename(editingId, editName.trim());
      onNotify('✅ Kişi adı güncellendi', 'success');
      setEditingId(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      if (persons.length <= 1) {
        onNotify('❌ En az bir kişi kalmalıdır!', 'error');
        setDeletingId(null);
        return;
      }
      onDelete(deletingId);
      onNotify('✅ Kişi silindi', 'success');
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <User size={16} className="text-purple-500" />
          Kişileri Yönet
        </h4>
        <span className="text-[10px] text-slate-400 font-bold italic">Toplam {persons.length} Kayıt</span>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Kişi / İsim</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-center">Durum</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">Eylem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {persons.map(person => (
              <tr key={person.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  {editingId === person.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        autoFocus
                        type="text"
                        className="bg-white border-2 border-purple-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm font-bold text-slate-700 w-full max-w-[160px]"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                      />
                      <button onClick={handleSaveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                        <Check size={18} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 font-black text-xs">
                        {person.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-700">{person.name}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {person.chatURL ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                      ✅ Bağlı
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-400 border border-slate-100">
                      ❌ Bağsız
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleStartEdit(person)}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition"
                      title="Düzenle"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => setDeletingId(person.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {persons.length === 0 && (
          <div className="p-10 text-center text-slate-400 italic text-sm">Hiç kayıtlı kişi bulunamadı.</div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 font-medium px-2 italic">
        * Yeni kişi eklemek için <strong>Adım 7: Grafik</strong> sekmesini kullanabilirsiniz.
      </p>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
              <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-3">
                <ShieldAlert className="text-red-500" size={24} />
                Kişiyi Sil?
              </h3>
              <p className="text-sm text-slate-600 font-medium mb-6 leading-relaxed">
                <strong>{persons.find(p => p.id === deletingId)?.name}</strong> adlı kişiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
                >
                  İptal
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition shadow-lg active:scale-95"
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
