import React, { useState, useEffect, useMemo } from 'react';
import { Clipboard, Check, Copy, Smile, ListTodo, Tags, Plus } from 'lucide-react';
import { useA3Storage } from '../hooks/useA3Storage';
import { A3DailyRecord } from '../types';

interface Step3FormProps {
  onCopyAll: (text: string) => void;
  onCopyCard: (text: string, id: string) => void;
  copiedId: string | null;
  baseDate: Date;
}

export const Step3Form: React.FC<Step3FormProps> = ({ onCopyAll, onCopyCard, copiedId, baseDate }) => {
  const { saveDailyRecord, getDailyRecord, customCategories, addCustomCategory } = useA3Storage();
  const dateStr = useMemo(() => baseDate.toISOString().split('T')[0], [baseDate]);

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
  const [exercises, setExercises] = useState([
    { time: '', detail: '' },
    { time: '', detail: '' },
    { time: '', detail: '' },
  ]);
  const [works, setWorks] = useState([
    { time: '', detail: '' },
    { time: '', detail: '' },
    { time: '', detail: '' },
  ]);
  const [reading, setReading] = useState({ time: '', detail: '' });

  // NEW CARDS STATE
  const [mood, setMood] = useState({ score: 5, emotion: '', note: '' });
  const [planning, setPlanning] = useState({
    plans: ['', '', '', ''],
    reals: ['', '', '', '']
  });
  const [activeCategories, setActiveCategories] = useState<{ name: string; hours: number }[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Load record for current date
  useEffect(() => {
    const record = getDailyRecord(dateStr);
    if (record) {
      setSleep(record.sleep);
      setWeight(record.weight);
      setMeals(record.meals);
      setExercises(record.exercises);
      setWorks(record.works);
      setReading(record.reading);
      setMood(record.mood || { score: 5, emotion: '', note: '' });
      setPlanning(record.planning || { plans: ['', '', '', ''], reals: ['', '', '', ''] });
      setActiveCategories(record.categories || []);
    } else {
      // Reset for new date
      setSleep({ bedTime: '', wakeTime: '' });
      setWeight('');
      setMeals([{ time: '', food: '' }, { time: '', food: '' }, { time: '', food: '' }, { time: '', food: '' }, { time: '', food: '' }]);
      setExercises([{ time: '', detail: '' }, { time: '', detail: '' }, { time: '', detail: '' }]);
      setWorks([{ time: '', detail: '' }, { time: '', detail: '' }, { time: '', detail: '' }]);
      setReading({ time: '', detail: '' });
      setMood({ score: 5, emotion: '', note: '' });
      setPlanning({ plans: ['', '', '', ''], reals: ['', '', '', ''] });
      setActiveCategories([]);
    }
  }, [dateStr]);

  // Auto-save whenever state changes
  useEffect(() => {
    const record: A3DailyRecord = {
      date: dateStr,
      sleep,
      weight,
      meals,
      exercises,
      works,
      reading,
      mood,
      planning,
      categories: activeCategories
    };
    saveDailyRecord(record);
  }, [dateStr, sleep, weight, meals, exercises, works, reading, mood, planning, activeCategories]);

  // Formatting functions
  const formatSleep = () => {
    if (!sleep.bedTime && !sleep.wakeTime) return "";
    let text = "";
    if (sleep.bedTime) text += `Dün akşam saat ${sleep.bedTime} de yattım\n`;
    if (sleep.wakeTime) text += `Bu sabah saat ${sleep.wakeTime} de kalktım`;
    return text.trim();
  };

  const formatWeight = () => weight ? `Bugün tartıldım: ${weight} kg` : "";

  const formatRows = (label: string, rows: { time: string; detail: string }[]) => {
    const validRows = rows.filter(r => r.time && r.detail);
    if (validRows.length === 0) return "";
    return `${label}:\n${validRows.map(r => `${r.time} - ${r.detail}`).join('\n')}`;
  };

  const formatMeals = () => {
    const validMeals = meals.filter(m => m.time && m.food);
    if (validMeals.length === 0) return "";
    return `Yediklerim:\n${validMeals.map(m => `${m.time} - ${m.food}`).join('\n')}`;
  };

  const formatReading = () => {
    if (!reading.time && !reading.detail) return "";
    return `Kitap okumak:\n${reading.time || '__:__'} - ${reading.detail || '...'}`;
  };

  const formatMood = () => {
    return `Duygu durumu: ${mood.score}/10 - ${mood.emotion || '-'} - ${mood.note || '-'}`;
  };

  const formatPlanning = () => {
    const validPlans = planning.plans.filter(p => p.trim());
    const validReals = planning.reals.filter(r => r.trim());
    if (validPlans.length === 0 && validReals.length === 0) return "";
    
    return `Planladıklarım:\n${validPlans.join(' / ')}\nGerçekleştirdiklerim:\n${validReals.join(' / ')}`;
  };

  const formatCategories = () => {
    if (activeCategories.length === 0) return "";
    return `İş/Aktivite:\n${activeCategories.map(c => `${c.name}: ${c.hours} sa`).join(' / ')}`;
  };

  const handleCopyAll = () => {
    const parts = [
      "Bugünkü bilgilerim:\n",
      formatSleep(),
      formatWeight(),
      formatMeals(),
      formatRows("Egzersiz", exercises),
      formatRows("Çalışma", works),
      formatReading(),
      formatMood(),
      formatPlanning(),
      formatCategories()
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
                placeholder={idx === 0 ? "08:30 - 2 yumurta, peynir, ekmek" : (idx === 1 ? "12:00 - Tavuk, salata" : "Ne yediğiniz...")}
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
        onCopy={() => onCopyCard(formatRows("Egzersiz", exercises), "exercise")}
      >
        <div className="space-y-3">
          {exercises.map((ex, idx) => (
            <div key={idx} className="flex space-x-2">
              <input 
                type="time" 
                className="w-1/3 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                value={ex.time}
                onChange={e => {
                  const newEx = [...exercises];
                  newEx[idx].time = e.target.value;
                  setExercises(newEx);
                }}
              />
              <input 
                type="text" 
                placeholder={
                  idx === 0 ? "08:30 - Leslie 1 mile, 20 dakika" : 
                  (idx === 1 ? "14:00 - 30 dakika yürüyüş" : "19:00 - Nefes egzersizi, 10 dakika")
                }
                className="w-2/3 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                value={ex.detail}
                onChange={e => {
                  const newEx = [...exercises];
                  newEx[idx].detail = e.target.value;
                  setExercises(newEx);
                }}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* --- Card 5: Çalışma --- */}
      <Card 
        title="💼 Çalışma" 
        id="work" 
        copiedId={copiedId} 
        onCopy={() => onCopyCard(formatRows("Çalışma", works), "work")}
      >
        <div className="space-y-3">
          {works.map((work, idx) => (
            <div key={idx} className="flex space-x-2">
              <input 
                type="time" 
                className="w-1/3 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                value={work.time}
                onChange={e => {
                  const newWork = [...works];
                  newWork[idx].time = e.target.value;
                  setWorks(newWork);
                }}
              />
              <input 
                type="text" 
                placeholder={
                  idx === 0 ? "09:00 - Excel raporu, 2 saat" : 
                  (idx === 1 ? "13:00 - Toplantı, 1 saat" : "15:00 - E-posta, 30 dakika")
                }
                className="w-2/3 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                value={work.detail}
                onChange={e => {
                  const newWork = [...works];
                  newWork[idx].detail = e.target.value;
                  setWorks(newWork);
                }}
              />
            </div>
          ))}
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

      {/* --- Card 7: Duygu Durumu --- */}
      <Card 
        title="😶 Duygu Durumu" 
        id="mood" 
        copiedId={copiedId} 
        onCopy={() => onCopyCard(formatMood(), "mood")}
      >
        <div className="space-y-6">
          <InputGroup label={`Bugün enerjim/ruh halim: ${mood.score}/10`}>
            <input 
              type="range" 
              min="1" max="10" 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              value={mood.score}
              onChange={e => setMood({...mood, score: parseInt(e.target.value)})}
            />
          </InputGroup>
          
          <InputGroup label="Baskın duygu:">
            <div className="flex flex-wrap gap-2">
              {['😟 Kaygılı', '😐 Nötr', '🙂 İyi', '😄 Enerjik', '😴 Yorgun', '😤 Stresli'].map(e => (
                <button
                  key={e}
                  onClick={() => setMood({...mood, emotion: e})}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                    mood.emotion === e 
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-105' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </InputGroup>

          <InputGroup label="Not (opsiyonel):">
            <input 
              type="text" 
              placeholder="Neden böyle hissettim?"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
              value={mood.note}
              onChange={e => setMood({...mood, note: e.target.value})}
            />
          </InputGroup>
        </div>
      </Card>

      {/* --- Card 8: Planlama --- */}
      <Card 
        title="📌 Planlama (Plan vs Gerçek)" 
        id="planning" 
        copiedId={copiedId} 
        onCopy={() => onCopyCard(formatPlanning(), "planning")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-xs font-bold text-blue-600 uppercase px-1">📋 Bugün Planladıklarım</label>
            {planning.plans.map((p, i) => (
              <input 
                key={i}
                type="text"
                placeholder={`${i+1}. planınız`}
                className="w-full p-2.5 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={p}
                onChange={e => {
                  const newPlans = [...planning.plans];
                  newPlans[i] = e.target.value;
                  setPlanning({...planning, plans: newPlans});
                }}
              />
            ))}
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-green-600 uppercase px-1">✅ Gerçekleştirdiklerim</label>
            {planning.reals.map((r, i) => (
              <input 
                key={i}
                type="text"
                placeholder={`${i+1}. gerçekleşen`}
                className="w-full p-2.5 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm"
                value={r}
                onChange={e => {
                  const newReals = [...planning.reals];
                  newReals[i] = e.target.value;
                  setPlanning({...planning, reals: newReals});
                }}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* --- Card 9: İş / Aktivite Kategorileri --- */}
      <Card 
        title="🏷️ İş / Aktivite Kategorileri" 
        id="categories" 
        copiedId={copiedId} 
        onCopy={() => onCopyCard(formatCategories(), "categories")}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
            {[
              '📚 Eğitim verme', '🎓 Eğitim alma', '💻 Proje çalışması', 
              '🤝 Toplantı', '✍️ İçerik üretme', '📖 Okuma/araştırma', 
              '👥 Sosyal/iletişim', '🎯 Planlama/strateji',
              ...customCategories
            ].map(cat => {
              const isActive = activeCategories.some(c => c.name === cat);
              return (
                <button
                  key={cat}
                  onClick={() => {
                    if (isActive) {
                      setActiveCategories(activeCategories.filter(c => c.name !== cat));
                    } else if (activeCategories.length < 8) {
                      setActiveCategories([...activeCategories, { name: cat, hours: 0 }]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isActive 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-indigo-600 border border-indigo-200 border-dashed hover:bg-indigo-50 flex items-center gap-1"
            >
              <Plus size={12} /> <span>Kendi kategorim</span>
            </button>
          </div>

          <div className="space-y-3">
            {activeCategories.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
                <span className="text-sm font-bold text-gray-700">{c.name}</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    step="0.5" 
                    min="0"
                    max="24"
                    className="w-20 p-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-right font-bold text-indigo-600"
                    value={c.hours}
                    onChange={e => {
                      const newCats = [...activeCategories];
                      newCats[i].hours = parseFloat(e.target.value) || 0;
                      setActiveCategories(newCats);
                    }}
                  />
                  <span className="text-xs font-bold text-gray-400 uppercase">saat</span>
                </div>
              </div>
            ))}
            {activeCategories.length === 0 && <p className="text-center text-xs text-gray-400 italic py-2">Henüz kategori seçilmedi</p>}
          </div>
        </div>

        {/* Custom Category Modal */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Yeni Kategori Ekle</h3>
              <input 
                autoFocus
                type="text" 
                placeholder="Örn: 🎨 Tasarım"
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none mb-6 font-medium"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (addCustomCategory(newCategoryName), setNewCategoryName(''), setIsCategoryModalOpen(false))}
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
                >
                  İptal
                </button>
                <button 
                  onClick={() => {
                    if(newCategoryName.trim()) {
                      addCustomCategory(newCategoryName.trim());
                      setNewCategoryName('');
                      setIsCategoryModalOpen(false);
                    }
                  }}
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg transition"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        )}
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
              <span className="text-lg uppercase tracking-wider font-extrabold">📋 Tümünü Kopyala</span>
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
