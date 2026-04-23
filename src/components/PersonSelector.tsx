import React, { useState } from 'react';
import { Plus, X, User } from 'lucide-react';
import { Person } from '../hooks/usePersonStorage';

interface PersonSelectorProps {
  persons: Person[];
  activePerson: Person;
  onSwitch: (id: string) => void;
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
}

export const PersonSelector: React.FC<PersonSelectorProps> = ({ 
  persons, 
  activePerson, 
  onSwitch, 
  onAdd, 
  onDelete 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName('');
      setShowAddModal(false);
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setShowDeleteModal(null);
  };

  return (
    <div className="mb-6 bg-linear-to-r from-purple-50 to-blue-50 p-4 rounded-3xl border-2 border-purple-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          👥 Kimin kilosunu takip ediyorsunuz?
        </h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition shadow-md active:scale-95 flex items-center gap-1"
        >
          <Plus size={16} />
          <span>Kişi Ekle</span>
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {persons.map((person) => (
          <div key={person.id} className="relative group">
            <button 
              onClick={() => onSwitch(person.id)}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 min-h-[44px] ${
                activePerson.id === person.id 
                  ? 'bg-purple-600 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-700 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              <User size={16} className={activePerson.id === person.id ? 'opacity-100' : 'opacity-40'} />
              <span>{person.name}</span>
              {person.chatURL && <span className="text-yellow-400 font-bold ml-1">✓</span>}
            </button>
            
            {persons.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(person.id);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
              >
                <X size={12} strokeWidth={3} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs font-bold text-gray-400 bg-white/50 px-3 py-2 rounded-xl inline-block border border-gray-100 uppercase tracking-widest">
        Aktif: <span className="text-purple-700">{activePerson.name}</span>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">➕ Yeni Kişi Ekle</h3>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="İsim (örn: Kardeşim, Eşim, Baba)"
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl mb-6 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-medium"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 font-bold transition"
              >
                İptal
              </button>
              <button 
                onClick={handleAdd}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 font-bold transition shadow-lg active:scale-95"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-2 text-gray-800">🗑️ Silmek istediğinize emin misiniz?</h3>
            <p className="mb-6 text-gray-600 leading-relaxed">
              <span className="font-bold text-gray-800">
                {persons.find(p => p.id === showDeleteModal)?.name}
              </span> kişisine ait tüm veriler ve kayıtlı sohbet URL'si kalıcı olarak silinecek.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 font-bold transition"
              >
                İptal
              </button>
              <button 
                onClick={() => handleDelete(showDeleteModal)}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 font-bold transition shadow-lg active:scale-95"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
