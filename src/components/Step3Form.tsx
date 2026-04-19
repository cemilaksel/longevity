import React, { useState } from 'react';
import { Clipboard, Check, Copy } from 'lucide-react';

interface Step3FormProps {
  onCopyAll: (text: string) => void;
  onCopyCard: (text: string, id: string) => void;
  copiedId: string | null;
}

export const Step3Form: React.FC<Step3FormProps> = ({ onCopyAll, onCopyCard, copiedId }) => {
  // State for form fields
  const [sleep, setSleep] = useState({ bedTime: '', wakeTime: '' });
  const [weight, setWeight] = useState('');
  const [meals, setMeals] = useState([
    { time: '', food: '' },
    { time: '', food: '' },
    { time: '', food: '' },
    { time: '', food: '' },
    { time: '', food: '' },
  ]);
  const [exercise, setExercise] = useState({ time: '', detail: '' });
  const [work, setWork] = useState({ time: '', detail: '' });
  const [reading, setReading] = useState({ time: '', detail: '' });

  // Formatting functions
  const formatSleep = () => {
    if (!sleep.bedTime && !sleep.wakeTime) return "";
    let text = "";
    if (sleep.bedTime) text += `Dün akşam saat ${sleep.bedTime} de yattım\n`;
    if (sleep.wakeTime) text += `Bu sabah saat ${sleep.wakeTime} de kalktım`;
    return text.trim();
  };

  const formatWeight = () => weight ? `Bugün tartıldım: ${weight} kg` : "";

  const formatMeals = () => {
    const validMeals = meals.filter(m => m.time || m.food);
    if (validMeals.length === 0) return "";
    return `Yediklerim:\n${validMeals.map(m => `${m.time || '__:__'} - ${m.food || '...'}`).join('\n')}`;
  };

  const formatExercise = () => {
    if (!exercise.time && !exercise.detail) return "";
    return `Egzersiz:\n${exercise.time || '__:__'} - ${exercise.detail || '...'}`;
  };

  const formatWork = () => {
    if (!work.time && !work.detail) return "";
    return `Çalışma:\n${work.time || '__:__'} - ${work.detail || '...'}`;
  };

  const formatReading = () => {
    if (!reading.time && !reading.detail) return "";
    return `Kitap okumak:\n${reading.time || '__:__'} - ${reading.detail || '...'}`;
  };

  const handleCopyAll = () => {
    const parts = [
      "Bugünkü bilgilerim:\n",
      formatSleep(),
      formatWeight(),
      formatMeals(),
      formatExercise(),
      formatWork(),
      formatReading()
    ].filter(p => p !== "");
    
    onCopyAll(parts.join('\n\n'));
  };

  return (
    <div className="space-y-6">
      {/* --- Card 1: Uyku --- */}
      <Card 
        title="😴 Uyku Bilgileri" 
        id="sleep" 
        copiedId={copiedId} 
        onCopy={() => onCopyCard(formatSleep(), "sleep")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Dün akşam saat:">
            <input 
              type="time" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
              value={sleep.bedTime}
              onChange={e => setSleep({...sleep, bedTime: e.target.value})}
            />
          </InputGroup>
          <InputGroup label="Bu sabah saat:">
            <input 
              type="time" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
              value={sleep.wakeTime}
              onChange={e => setSleep({...sleep, wakeTime: e.target.value})}
            />
          </InputGroup>
        </div>
      </Card>

      {/* --- Card 2: Tartı --- */}
      <Card 
        title="⚖️ Tartı" 
        id="weight" 
        copiedId={copiedId} 
        onCopy={() => onCopyCard(formatWeight(), "weight")}
      >
        <InputGroup label="Bugünkü kilom:">
          <input 
            type="number" 
            step="0.1" 
            placeholder="örn: 99.9"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
            value={weight}
            onChange={e => setWeight(e.target.value)}
          />
        </InputGroup>
      </Card>

      {/* --- Card 3: Yediklerim --- */}
      <Card 
        title="🍽️ Yediklerim" 
        id="meals" 
        copiedId={copiedId} 
        onCopy={() => onCopyCard(formatMeals(), "meals")}
      >
        <div className="space-y-3">
          {meals.map((meal, idx) => (
            <div key={idx} className="flex space-x-2">
              <input 
                type="time" 
                className="w-1/3 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                value={meal.time}
                onChange={e => {
                  const newMeals = [...meals];
                  newMeals[idx].time = e.target.value;
                  setMeals(newMeals);
                }}
              />
              <input 
                type="text" 
                placeholder="Ne yediğiniz..."
                className="w-2/3 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                value={meal.food}
                onChange={e => {
                  const newMeals = [...meals];
                  newMeals[idx].food = e.target.value;
                  setMeals(newMeals);
                }}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* --- Card 4: Egzersiz --- */}
      <Card 
        title="🏃 Egzersiz" 
        id="exercise" 
        copiedId={copiedId} 
        onCopy={() => onCopyCard(formatExercise(), "exercise")}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputGroup label="Saat:">
            <input 
              type="time" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
              value={exercise.time}
              onChange={e => setExercise({...exercise, time: e.target.value})}
            />
          </InputGroup>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase px-1">Egzersiz türü ve süresi:</label>
            <input 
              type="text" 
              placeholder="örn: 30 dk yürüyüş"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
              value={exercise.detail}
              onChange={e => setExercise({...exercise, detail: e.target.value})}
            />
          </div>
        </div>
      </Card>

      {/* --- Card 5: Çalışma --- */}
      <Card 
        title="💼 Çalışma" 
        id="work" 
        copiedId={copiedId} 
        onCopy={() => onCopyCard(formatWork(), "work")}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputGroup label="Saat:">
            <input 
              type="time" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
              value={work.time}
              onChange={e => setWork({...work, time: e.target.value})}
            />
          </InputGroup>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase px-1">Ne üzerinde çalıştınız:</label>
            <input 
              type="text" 
              placeholder="örn: Excel raporu"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
              value={work.detail}
              onChange={e => setWork({...work, detail: e.target.value})}
            />
          </div>
        </div>
      </Card>

      {/* --- Card 6: Kitap --- */}
      <Card 
        title="📚 Kitap Okumak" 
        id="reading" 
        copiedId={copiedId} 
        onCopy={() => onCopyCard(formatReading(), "reading")}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputGroup label="Saat:">
            <input 
              type="time" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
              value={reading.time}
              onChange={e => setReading({...reading, time: e.target.value})}
            />
          </InputGroup>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase px-1">Kitap adı ve süre:</label>
            <input 
              type="text" 
              placeholder="örn: Atomic Habits - 30 dk"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
              value={reading.detail}
              onChange={e => setReading({...reading, detail: e.target.value})}
            />
          </div>
        </div>
      </Card>

      {/* --- Global Copy Button --- */}
      <div className="pt-4 pb-2">
        <button
          onClick={handleCopyAll}
          className={`flex items-center justify-center space-x-3 w-full py-4 bg-linear-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 group min-h-[64px] ${
            copiedId === 'all' ? 'from-green-500 to-green-600' : ''
          }`}
        >
          {copiedId === 'all' ? (
            <>
              <Check className="w-6 h-6 animate-bounce" />
              <span className="text-lg">Tüm Bilgiler Kopyalandı!</span>
            </>
          ) : (
            <>
              <Clipboard className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-lg">📋 Tümünü Kopyala</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- Helper Components ---

function Card({ 
  title, 
  id, 
  copiedId, 
  onCopy, 
  children 
}: { 
  title: string, 
  id: string, 
  copiedId: string | null, 
  onCopy: () => void, 
  children: React.ReactNode 
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xs p-5 relative group overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-teal-dark flex items-center">
          {title}
        </h3>
        <button
          onClick={onCopy}
          className={`p-2 rounded-lg transition-all duration-200 flex items-center space-x-1 ${
            copiedId === id 
              ? 'bg-green-500 text-white' 
              : 'bg-green-50 text-green-700 hover:bg-green-100'
          }`}
          title="Kartı kopyala"
        >
          {copiedId === id ? <Check size={16} /> : <Copy size={16} />}
          <span className="text-[10px] font-bold uppercase">{copiedId === id ? "Kopyalandı" : "Kopyala"}</span>
        </button>
      </div>
      {children}
    </div>
  );
}

function InputGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-500 uppercase px-1">{label}</label>
      {children}
    </div>
  );
}
