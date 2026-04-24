import React, { useState } from 'react';
import { Person } from '../hooks/usePersonStorage';
import { formatChatDate } from '../hooks/useGPTStorage';

interface PersonGPTButtonsProps {
  newChatUrl: string;
  activePerson: Person;
  savePersonChatURL: (url: string) => boolean;
}

export const PersonGPTButtons: React.FC<PersonGPTButtonsProps> = ({ 
  newChatUrl, 
  activePerson, 
  savePersonChatURL 
}) => {
  const [showSaveArea, setShowSaveArea] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleSave = () => {
    const trimmed = urlInput.trim();
    if (trimmed && trimmed.includes('chatgpt.com')) {
      savePersonChatURL(trimmed);
      setUrlInput('');
      setShowSaveArea(false);
    }
  };

  const goToLastChat = () => {
    if (activePerson.chatURL) {
      window.open(activePerson.chatURL, '_blank');
    }
  };

  return (
    <div className="mb-6 bg-gray-50 p-4 md:p-6 rounded-3xl border border-gray-200 shadow-xs">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        🔗 MS Project Pro - <span className="text-purple-700">{activePerson.name}</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <button 
          onClick={() => window.open(newChatUrl, '_blank')}
          className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-2xl font-bold transition shadow-md min-h-[56px] text-sm"
        >
          🆕 Yeni Sohbet Başlat
        </button>
        
        <button 
          onClick={goToLastChat}
          disabled={!activePerson.chatURL}
          className={`bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-2xl font-bold transition shadow-md min-h-[56px] text-sm ${
            !activePerson.chatURL ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {activePerson.chatURL && activePerson.chatDate 
            ? `📝 Son Sohbet (${formatChatDate(activePerson.chatDate)})` 
            : '📝 Son Sohbet (Yok)'}
        </button>
        
        <button 
          onClick={() => setShowSaveArea(!showSaveArea)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-2xl font-bold transition shadow-md min-h-[56px] text-sm"
        >
          💾 URL Kaydet
        </button>
      </div>
      
      {showSaveArea && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="mb-4">
            <p className="font-bold text-gray-800 mb-2 text-sm flex items-center gap-1">
              💡 <span className="text-purple-700">{activePerson.name}</span> için URL kaydet
            </p>
            <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside leading-relaxed">
              <li>"🆕 Yeni Sohbet Başlat" ile MS Project Pro'yu açın</li>
              <li>Grafik promptunu gönderin</li>
              <li>Tarayıcı adres çubuğundaki URL'yi kopyalayın</li>
              <li>Aşağıya yapıştırıp "Kaydet" butonuna tıklayın</li>
            </ol>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://chatgpt.com/c/abc123..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            />
            <button 
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition active:scale-95 whitespace-nowrap text-sm"
            >
              ✅ Kaydet
            </button>
          </div>
          
          <p className="text-[10px] text-gray-500 mt-2 italic px-1">
            ℹ️ Kayıtlarınız siz silmediğiniz sürece kalır
          </p>
        </div>
      )}
    </div>
  );
};
